using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
            int pagina = 1101;
            var spras = "ES";
            REPORT_MOD rm = new REPORT_MOD();

            using (WFARTHAEntities db = new WFARTHAEntities())
            {
                FnCommon.ObtenerConfPage(db, pagina, User.Identity.Name, this.ControllerContext.Controller);
                string uz = User.Identity.Name;
                var tsoll = (from ts in db.TSOLs
                             join tt in db.TSOLTs
                             on ts.ID equals tt.TSOL_ID
                             into jj
                             from tt in jj.DefaultIfEmpty()
                             where ts.ESTATUS == "X" && tt.SPRAS_ID.Equals(spras)
                             select new
                             {
                                 ts.ID,
                                 TEXT = ts.ID + " - " + tt.TXT50
                             }).ToList();
                var sociedades = (from tp in db.DET_TIPOPRESUPUESTO
                                  join soc in db.SOCIEDADs
                                  on tp.BUKRS equals soc.BUKRS
                                  where tp.ID_USER == uz
                                  select new { soc.BUKRS, TEXT = soc.BUKRS + " - " + soc.BUTXT }).ToList();
                List<DOCUMENTO> docs = new List<DOCUMENTO>();
                for (int i = 0; i < sociedades.Count(); i++)
                {
                    string buk = sociedades[i].BUKRS;
                    List<DOCUMENTO> doc = db.DOCUMENTOes.Where(x => x.SOCIEDAD_ID == buk).OrderBy(x => x.NUM_DOC).ToList();
                    foreach (DOCUMENTO d in doc)
                    {
                        docs.Add(d);
                    }
                }
                List<string> fechas1 = new List<string>();
                List<string> prov1 = new List<string>();
                List<string> nsap1 = new List<string>();
                List<string> user1 = new List<string>();
                List<string> ndoc1 = new List<string>();
                List<string> mont1 = new List<string>();
                List<SelectListItem> fechas = new List<SelectListItem>();
                List<SelectListItem> prov = new List<SelectListItem>();
                List<SelectListItem> nsap = new List<SelectListItem>();
                List<SelectListItem> user = new List<SelectListItem>();
                List<SelectListItem> ndoc = new List<SelectListItem>();
                List<SelectListItem> mont = new List<SelectListItem>();
                foreach (DOCUMENTO dd in docs)
                {
                    var u = db.USUARIOs.Where(x => x.ID == dd.USUARIOD_ID).FirstOrDefault();
                    var p = db.PROVEEDORs.Where(x => x.LIFNR == (!string.IsNullOrEmpty(dd.PAYER_ID) ? dd.PAYER_ID : "1")).FirstOrDefault();

                    if (dd.FECHAC_USER != null && !fechas1.Contains(dd.FECHAC_USER.ToString()))
                    {
                        fechas1.Add(dd.FECHAC_USER.ToString());
                        string fech = string.Format(DateTime.Parse(dd.FECHAC_USER.ToString()).ToString(@"dd/MM/yyyy"));
                        fechas.Add(new SelectListItem() { Text = fech, Value = dd.FECHAC_USER.ToString() });
                    }
                    if (dd.PAYER_ID != null && !prov1.Contains(dd.PAYER_ID))
                    {
                        prov1.Add(dd.PAYER_ID);
                        prov.Add(new SelectListItem() { Text = p.LIFNR + " - " + p.NAME1, Value = p.LIFNR });
                    }
                    if (dd.NUM_PRE != null && !nsap1.Contains(dd.NUM_PRE))
                    {
                        nsap1.Add(dd.NUM_PRE);
                        nsap.Add(new SelectListItem() { Text = dd.NUM_PRE, Value = dd.NUM_PRE });
                    }
                    if (dd.USUARIOD_ID != null && !user1.Contains(dd.USUARIOD_ID))
                    {
                        user1.Add(dd.USUARIOD_ID);
                        user.Add(new SelectListItem() { Text = u.ID + " - " + u.NOMBRE + " " + u.APELLIDO_P + " " + u.APELLIDO_M, Value = u.ID });
                    }
                    if (dd.NUM_DOC.ToString() != null && !ndoc1.Contains(dd.NUM_DOC.ToString()))
                    {
                        ndoc1.Add(dd.NUM_DOC.ToString());
                        ndoc.Add(new SelectListItem() { Text = dd.NUM_DOC.ToString(), Value = dd.NUM_DOC.ToString() });
                    }
                    if (dd.MONTO_DOC_MD != null && !mont1.Contains(dd.MONTO_DOC_MD.ToString()))
                    {
                        mont1.Add(dd.MONTO_DOC_MD.ToString());
                        mont.Add(new SelectListItem() { Text = dd.MONTO_DOC_MD.ToString(), Value = dd.MONTO_DOC_MD.ToString() });
                    }
                }
                var moneda = db.MONEDAs.Where(m => m.ACTIVO == true).Select(m => new { m.WAERS, TEXT = m.WAERS + " - " + m.LTEXT }).ToList();
                var stat = db.DOCUMENTOes.Select(x => new { x.ESTATUS, TEXT = x.ESTATUS }).Distinct().ToList();
                List<SelectListItem> lst = new List<SelectListItem>
                {
                    new SelectListItem() { Text = "Pagado", Value = "P" },
                    new SelectListItem() { Text = "Efectivamente Pagado", Value = "EP" }
                };

                ViewBag.tsol = new SelectList(tsoll, "ID", "TEXT");
                ViewBag.bukrs = new SelectList(sociedades, "BUKRS", "TEXT");
                ViewBag.fecha = new SelectList(fechas, "Value", "Text");
                ViewBag.payer = new SelectList(prov, "Value", "Text");
                ViewBag.num_pre = new SelectList(nsap, "Value", "Text");
                ViewBag.user = new SelectList(user, "Value", "Text");
                ViewBag.num_doc = new SelectList(ndoc, "Value", "Text");
                ViewBag.monto = new SelectList(mont, "Value", "Text");
                ViewBag.moneda = new SelectList(moneda, "WAERS", "TEXT");
                ViewBag.estatus = new SelectList(stat, "ESTATUS", "TEXT");
                ViewBag.pagado = new SelectList(lst, "Value", "Text");
            }
            return View();
        }
        [HttpPost]
        public ActionResult ReportTemplate(int id)
        {
            int pagina = 1101; //ID EN BASE DE DATOS
            using (WFARTHAEntities db = new WFARTHAEntities())
            {
                FnCommon.ObtenerConfPage(db, pagina, User.Identity.Name, this.ControllerContext.Controller);

                SP_CABECERA_Result c = db.SP_CABECERA(id).Single();
                List<SP_DETALLE_Result> d = db.SP_DETALLE(id).ToList();
                //List<SP_FIRMAS_Result> f = db.SP_FIRMAS(id).ToList();
                List<ReportFirmasResult> f = db.Database.SqlQuery<ReportFirmasResult>("SP_FIRMAS @NUM_DOC",new SqlParameter("@NUM_DOC", id)).ToList();

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
                    if (cont == 1 || cont2 == 0)
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
        [HttpPost]
        public ActionResult ReportTemplate2([Bind(Include = "Tsol,Bukrs,Fecha,Payer,Num_pre,User,Num_doc,Monto,Moneda,Estatus,Pagado")] Models.REPORT_MOD rep)
        {
            int pagina = 1101; //ID EN BASE DE DATOS
            using (WFARTHAEntities db = new WFARTHAEntities())
            {
                FnCommon.ObtenerConfPage(db, pagina, User.Identity.Name, this.ControllerContext.Controller);
                string uz = User.Identity.Name;
                var sociedades = (from tp in db.DET_TIPOPRESUPUESTO
                                  join soc in db.SOCIEDADs
                                  on tp.BUKRS equals soc.BUKRS
                                  where tp.ID_USER == uz
                                  select new { soc.BUKRS, TEXT = soc.BUKRS + " - " + soc.BUTXT }).ToList();
                List<DOCUMENTO> docs = new List<DOCUMENTO>();
                
                List<ReportSols> solicitudes = new List<ReportSols>();

                ReportEsqueleto2 re = new ReportEsqueleto2();
                string recibeRuta = re.crearPDF(solicitudes);
                ViewBag.url = Request.Url.OriginalString.Replace(Request.Url.PathAndQuery, "") + HostingEnvironment.ApplicationVirtualPath + "/" + recibeRuta;
                ViewBag.miNum = uz;

                return View();
            }
        }
    }
}