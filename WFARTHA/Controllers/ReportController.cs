﻿using System;
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
                var puesto_user = db.USUARIOs.Where(x => x.ID == uz).Select(x => x.PUESTO_ID).FirstOrDefault();
                var tsoll = (from ts in db.TSOLs
                             join tt in db.TSOLTs
                             on ts.ID equals tt.TSOL_ID
                             into jj
                             from tt in jj.DefaultIfEmpty()
                             where ts.ESTATUS == "X" && tt.SPRAS_ID.Equals(spras) && ts.ID.Equals("SRE")
                             select new
                             {
                                 Value = ts.ID,
                                 Text = ts.ID + " - " + tt.TXT50
                             }).ToList();
                if (puesto_user != 4)
                {
                    tsoll = (from ts in db.TSOLs
                             join tt in db.TSOLTs
                             on ts.ID equals tt.TSOL_ID
                             into jj
                             from tt in jj.DefaultIfEmpty()
                             where ts.ESTATUS == "X" && tt.SPRAS_ID.Equals(spras)
                             select new
                             {
                                 Value = ts.ID,
                                 Text = ts.ID + " - " + tt.TXT50
                             }).ToList();
                }
                var sociedades = (from tp in db.DET_TIPOPRESUPUESTO
                                  join soc in db.SOCIEDADs
                                  on tp.BUKRS equals soc.BUKRS
                                  where tp.ID_USER == uz
                                  select new { Value = soc.BUKRS, Text = soc.BUKRS + " - " + soc.BUTXT }).ToList();
                List<DOCUMENTO> docs = new List<DOCUMENTO>();
                for (int i = 0; i < sociedades.Count(); i++)
                {
                    string buk = sociedades[i].Value;
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
                var moneda = db.MONEDAs.Where(m => m.ACTIVO == true).Select(m => new { Value = m.WAERS, Text = m.WAERS + " - " + m.LTEXT }).ToList();
                //var stat = db.DOCUMENTOes.Select(x => new { Value = x.ESTATUS, Text = x.ESTATUS }).Distinct().ToList();

                List<SelectListItem> stat = new List<SelectListItem>
                {
                    new SelectListItem() { Text = "Eliminando Solicitud", Value = ",A,,,," },
                    new SelectListItem() { Text = "Error Eliminar", Value = ",B,,,," },
                    new SelectListItem() { Text = "Solicitud Eliminada", Value = ",C,,,," },
                    new SelectListItem() { Text = "Borrador", Value = "B,,,,," },
                    new SelectListItem() { Text = "Contabilizado SAP", Value = "A,,,,," },
                    new SelectListItem() { Text = "Procesando Preliminar", Value = "N,,,null/P,G," },
                    new SelectListItem() { Text = "Error Preliminar Portal", Value = "N,,,null/P,E," },
                    new SelectListItem() { Text = "Error Preliminar SAP", Value = "N,,E,,E," },
                    new SelectListItem() { Text = "Se Generó Preliminar SAP", Value = "N,,P,,G," },
                    new SelectListItem() { Text = "Pendiente Aprobador", Value = "F,,,P/S,G,P" },
                    new SelectListItem() { Text = "Pendiente Contabilizar", Value = "C,,,P,G,P" },
                    new SelectListItem() { Text = "Error Contabilizar Portal", Value = "C,,,A,E,P" },
                    new SelectListItem() { Text = "Procesando Contabilizar SAP", Value = "C,,!E,A,G," },
                    new SelectListItem() { Text = "Error Contabilizar SAP", Value = "C,,E,A,,P" },
                    new SelectListItem() { Text = "Por Contabilizar", Value = "C,,,A,," },
                    new SelectListItem() { Text = "Contabilizar SAP", Value = "P,,,A,," },
                    new SelectListItem() { Text = "Aprobada", Value = ",,,A,," },
                    new SelectListItem() { Text = "Pendiente Corrección", Value = "F,,,R,G,P" },
                    new SelectListItem() { Text = "Pendiente Tax", Value = ",,,T,," },
                    new SelectListItem() { Text = "Estatus desconocido", Value = ",,,,," }
                };
                List<SelectListItem> lst = new List<SelectListItem>
                {
                    new SelectListItem() { Text = "Pagado", Value = "P" },
                    new SelectListItem() { Text = "Efectivamente Pagado", Value = "EP" }
                };

                ViewBag.tsol = new SelectList(tsoll, "Value", "Text");
                ViewBag.bukrs = new SelectList(sociedades, "Value", "Text");
                ViewBag.fecha = new SelectList(fechas, "Value", "Text");
                ViewBag.payer = new SelectList(prov, "Value", "Text");
                ViewBag.num_pre = new SelectList(nsap, "Value", "Text");
                ViewBag.user = new SelectList(user, "Value", "Text");
                ViewBag.num_doc = new SelectList(ndoc, "Value", "Text");
                ViewBag.monto = new SelectList(mont, "Value", "Text");
                ViewBag.moneda = new SelectList(moneda, "Value", "Text");
                ViewBag.estatus = new SelectList(stat, "Value", "Text");
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
                                  select new { Value = soc.BUKRS, TEXT = soc.BUKRS + " - " + soc.BUTXT }).ToList();
                List<DOCUMENTO> docs = new List<DOCUMENTO>();
                for (int i = 0; i < sociedades.Count(); i++)
                {
                    string buk = sociedades[i].Value;
                    List<DOCUMENTO> doc = db.DOCUMENTOes.Where(x => x.SOCIEDAD_ID == buk).OrderBy(x => x.NUM_DOC).ToList();
                    foreach (DOCUMENTO d in doc)
                    {
                        docs.Add(d);
                    }
                }
                List<DOCUMENTO> docs1 = new List<DOCUMENTO>();
                if (rep.Tsol != null) // filtrado por Tipo de solicitud
                {
                    for (int i = 0; i < rep.Tsol.Count(); i++)
                    {
                        string com = rep.Tsol[i];
                        List<DOCUMENTO> doc = docs.Where(x => x.TSOL_ID == com).ToList();
                        foreach (DOCUMENTO d in doc)
                        {
                            docs1.Add(d);
                        }
                    }
                    docs = docs1;
                    docs1 = new List<DOCUMENTO>();
                }
                if (rep.Bukrs != null) // filtrado por sociedad
                {
                    for (int i = 0; i < rep.Bukrs.Count(); i++)
                    {
                        string com = rep.Bukrs[i];
                        List<DOCUMENTO> doc = docs.Where(x => x.SOCIEDAD_ID == com).ToList();
                        foreach (DOCUMENTO d in doc)
                        {
                            docs1.Add(d);
                        }
                    }
                    docs = docs1;
                    docs1 = new List<DOCUMENTO>();
                }
                if (rep.Fecha != null) // filtrado por fecha
                {
                    for (int i = 0; i < rep.Fecha.Count(); i++)
                    {
                        DateTime com = DateTime.Parse(rep.Fecha[i]);
                        List<DOCUMENTO> doc = docs.Where(x => x.FECHAC_USER == com).ToList();
                        foreach (DOCUMENTO d in doc)
                        {
                            docs1.Add(d);
                        }
                    }
                    docs = docs1;
                    docs1 = new List<DOCUMENTO>();
                }
                if (rep.Payer != null) // filtrado por proveedor
                {
                    for (int i = 0; i < rep.Payer.Count(); i++)
                    {
                        string com = rep.Payer[i];
                        List<DOCUMENTO> doc = docs.Where(x => x.PAYER_ID == com).ToList();
                        foreach (DOCUMENTO d in doc)
                        {
                            docs1.Add(d);
                        }
                    }
                    docs = docs1;
                    docs1 = new List<DOCUMENTO>();
                }
                if (rep.Num_pre != null) // filtrado por numero sap
                {
                    for (int i = 0; i < rep.Num_pre.Count(); i++)
                    {
                        string com = rep.Num_pre[i];
                        List<DOCUMENTO> doc = docs.Where(x => x.PAYER_ID == com).ToList();
                        foreach (DOCUMENTO d in doc)
                        {
                            docs1.Add(d);
                        }
                    }
                    docs = docs1;
                    docs1 = new List<DOCUMENTO>();
                }
                if (rep.User != null) // filtrado por solicitante
                {
                    for (int i = 0; i < rep.User.Count(); i++)
                    {
                        string com = rep.User[i];
                        List<DOCUMENTO> doc = docs.Where(x => x.USUARIOD_ID == com).ToList();
                        foreach (DOCUMENTO d in doc)
                        {
                            docs1.Add(d);
                        }
                    }
                    docs = docs1;
                    docs1 = new List<DOCUMENTO>();
                }
                if (rep.Num_doc != null) // filtrado por numero de documento
                {
                    for (int i = 0; i < rep.Num_doc.Count(); i++)
                    {
                        decimal com = decimal.Parse(rep.Num_doc[i]);
                        List<DOCUMENTO> doc = docs.Where(x => x.NUM_DOC == com).ToList();
                        foreach (DOCUMENTO d in doc)
                        {
                            docs1.Add(d);
                        }
                    }
                    docs = docs1;
                    docs1 = new List<DOCUMENTO>();
                }
                if (rep.Monto != null) // filtrado por monto
                {
                    for (int i = 0; i < rep.Monto.Count(); i++)
                    {
                        decimal com = decimal.Parse(rep.Monto[i]);
                        List<DOCUMENTO> doc = docs.Where(x => x.MONTO_DOC_MD == com).ToList();
                        foreach (DOCUMENTO d in doc)
                        {
                            docs1.Add(d);
                        }
                    }
                    docs = docs1;
                    docs1 = new List<DOCUMENTO>();
                }
                if (rep.Moneda != null) // filtrado por moneda
                {
                    for (int i = 0; i < rep.Moneda.Count(); i++)
                    {
                        string com = rep.Moneda[i];
                        List<DOCUMENTO> doc = docs.Where(x => x.MONEDA_ID == com).ToList();
                        foreach (DOCUMENTO d in doc)
                        {
                            docs1.Add(d);
                        }
                    }
                    docs = docs1;
                    docs1 = new List<DOCUMENTO>();
                }
                if (rep.Estatus != null) // filtrado por estatus
                {
                    for (int i = 0; i < rep.Estatus.Count(); i++)
                    {
                        var stats = rep.Estatus[i].Split(',');
                        var statswf = stats[3].Split('/');
                        List<DOCUMENTO> doc = new List<DOCUMENTO>();
                        if (statswf.Length == 1)
                        {
                            doc = docs.Where(x => x.ESTATUS == stats[0] && x.ESTATUS_C == stats[1] && x.ESTATUS_SAP == stats[2] && x.ESTATUS_WF == stats[3] && x.ESTATUS_PRE == stats[4]).ToList();
                        }
                        else
                        {
                            doc = docs.Where(x => x.ESTATUS == stats[0] && x.ESTATUS_C == stats[1] && x.ESTATUS_SAP == stats[2] && (x.ESTATUS_WF == statswf[0]||x.ESTATUS_WF==statswf[1]) && x.ESTATUS_PRE == stats[4]).ToList();
                        }
                        foreach (DOCUMENTO d in doc)
                        {
                            docs1.Add(d);
                        }
                    }
                    docs = docs1;
                    docs1 = new List<DOCUMENTO>();
                }

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