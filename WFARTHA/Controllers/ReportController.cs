using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using WFARTHA.Common;
using WFARTHA.Entities;
using WFARTHA.Models;

namespace WFARTHA.Controllers
{
    public class ReportController : Controller
    {
        public ActionResult Index(string ruta, decimal ids)
        {
            int pagina = 1101; //ID EN BASE DE DATOS
            using (WFARTHAEntities db = new WFARTHAEntities())
            {
                FnCommon.ObtenerConfPage(db, pagina, User.Identity.Name, this.ControllerContext.Controller);
            }

            ViewBag.url = Request.Url.OriginalString.Replace(Request.Url.PathAndQuery, "") + HostingEnvironment.ApplicationVirtualPath + "/" + ruta;
            ViewBag.miNum = ids;

            return View();
        }
        // GET: Report
        public ActionResult Reporte()
        {
            return View();
        }

        public ActionResult ReportTemplate(int id)
        {
            //int Width = 100;
            //int Height = 650;
            //string ReportDescription = "Performance Report";
            //string ReportName = "ChequesReport";
            //string reportServer = "http://sf-0024/ReportServer";
            //string reportFolder = "WFARTHAChequesCaratula";

            //var rptInfo = new ReportInfo
            //{
            //    ReportId = id,
            //    ReportName = ReportName,
            //    ReportServer = reportServer,
            //    ReportFolder = reportFolder,
            //    ReportDescription = ReportDescription,
            //    ReportURL = String.Format("../../Reports/ReportTemplate.aspx?ReportName={0}&Height={1}&ReportServer={2}&ReportFolder={3}&ReportId={4}", ReportName, Height, reportServer, reportFolder, id),
            //    Width = Width,
            //    Height = Height
            //};

            //return View(rptInfo);
            using (WFARTHAEntities db = new WFARTHAEntities())
            {
                decimal? total = 0;
                SP_CABECERA_Result c = db.SP_CABECERA(id).Single();
                List<SP_DETALLE_Result> d = db.SP_DETALLE(id).ToList();
                ReportCabecera cab = new ReportCabecera
                {
                    NUM_DOC = c.NUM_DOC.ToString(),
                    NUM_PRE = c.NUM_PRE,
                    SOCIEDAD_ID = c.SOCIEDAD_ID,
                    SOCIEDAD_TEXT = c.SOCIEDAD_TEXT,
                    PAYER_ID = c.PAYER_ID,
                    PAYER_NAME1 = c.PAYER_NAME1,
                    MONTO_DOC_MD = c.MONTO_DOC_MD.ToString(),
                    CONDICIONES_ID = c.CONDICIONES_ID,
                    CONDICIONES_TEXT = c.CONDICIONES_TEXT,
                    CONCEPTO = (c.CONCEPTO ?? "")
                };
                List<ReportDetalle> det = new List<ReportDetalle>();
                foreach (SP_DETALLE_Result dd in d)
                {
                    ReportDetalle rd = new ReportDetalle
                    {
                        CONCEPTO = dd.CONCEPTO,
                        DESCRIPCION = dd.DESCRIPCION,
                        FACTURA = dd.FACTURA,
                        IMPORTE = dd.IMPORTE.ToString(),
                        TEXTO = (dd.TEXTO ?? "")
                    };
                    total += dd.IMPORTE;
                    det.Add(rd);
                }
                ReportEsqueleto re = new ReportEsqueleto();
                string recibeRuta = re.crearPDF(cab, det, total);
                return RedirectToAction("Index", new { ruta = recibeRuta, ids = c.NUM_DOC });
                //ViewBag.url = Request.Url.OriginalString.Replace(Request.Url.PathAndQuery, "") + HostingEnvironment.ApplicationVirtualPath + "/" + ruta;
                //return View();
            }
        }
    }
}