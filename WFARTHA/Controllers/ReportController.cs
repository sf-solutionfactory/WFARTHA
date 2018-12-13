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
            int pagina = 1101; //ID EN BASE DE DATOS
            using (WFARTHAEntities db = new WFARTHAEntities())
            {
                FnCommon.ObtenerConfPage(db, pagina, User.Identity.Name, this.ControllerContext.Controller);

                SP_CABECERA_Result c = db.SP_CABECERA(id).Single();
                List<SP_DETALLE_Result> d = db.SP_DETALLE(id).ToList();
                List<SP_FIRMAS_Result> f = db.SP_FIRMAS(id).ToList();
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
                    det.Add(rd);
                }
                List<ReportFirmas> fir = new List<ReportFirmas>();
                var cont = 1;
                var cont2 = f.Count();
                ReportFirmas rf = new ReportFirmas();
                for (int i = 0; i < f.Count(); i++)
                {
                    if (cont == 1)
                    {
                        rf = new ReportFirmas();
                    }
                    switch (cont)
                    {
                        case 1:
                            rf.fasen1 = f[i].fasen.ToString();
                            rf.faseletrero1 = f[i].faseletrero;
                            rf.usuariocadena1 = f[i].usuariocadena;
                            rf.fecham1 = string.Format(DateTime.Parse(f[i].fecham.ToString()).ToString(@"dd/MM/yyyy"));
                            cont++;
                            cont2--;
                            break;
                        case 2:
                            rf.fasen2 = (f[i].fasen.ToString() ?? "");
                            rf.faseletrero2 = (f[i].faseletrero ?? "");
                            rf.usuariocadena2 = (f[i].usuariocadena ?? "");
                            rf.fecham2 = (string.Format(DateTime.Parse(f[i].fecham.ToString()).ToString(@"dd/MM/yyyy")) ?? "");
                            cont++;
                            cont2--;
                            break;
                        case 3:
                            rf.fasen3 = (f[i].fasen.ToString() ?? "");
                            rf.faseletrero3 = (f[i].faseletrero ?? "");
                            rf.usuariocadena3 = (f[i].usuariocadena ?? "");
                            rf.fecham3 = (string.Format(DateTime.Parse(f[i].fecham.ToString()).ToString(@"dd/MM/yyyy")) ?? "");
                            cont++;
                            cont2--;
                            break;
                        case 4:
                            rf.fasen4 = (f[i].fasen.ToString() ?? "");
                            rf.faseletrero4 = (f[i].faseletrero ?? "");
                            rf.usuariocadena4 = (f[i].usuariocadena ?? "");
                            rf.fecham4 = (string.Format(DateTime.Parse(f[i].fecham.ToString()).ToString(@"dd/MM/yyyy")) ?? "");
                            cont++;
                            cont2--;
                            break;
                        case 5:
                            rf.fasen5 = (f[i].fasen.ToString() ?? "");
                            rf.faseletrero5 = (f[i].faseletrero ?? "");
                            rf.usuariocadena5 = (f[i].usuariocadena ?? "");
                            rf.fecham5 = (string.Format(DateTime.Parse(f[i].fecham.ToString()).ToString(@"dd/MM/yyyy")) ?? "");
                            cont = 1;
                            cont2--;
                            break;
                    }
                    if (cont == 5 || cont2 == 0)
                    {
                        fir.Add(rf);
                    }
                }

                ReportEsqueleto re = new ReportEsqueleto();
                string recibeRuta = re.crearPDF(cab, det, fir);
                ViewBag.url = Request.Url.OriginalString.Replace(Request.Url.PathAndQuery, "") + HostingEnvironment.ApplicationVirtualPath + "/" + recibeRuta;
                ViewBag.miNum = c.NUM_DOC;

                return View();
            }
        }
    }
}