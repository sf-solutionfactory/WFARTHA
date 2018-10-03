﻿using ExcelDataReader;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Linq.Dynamic;
using WFARTHA.Entities;
using WFARTHA.Models;
using WFARTHA.Services;
using System.Linq.Expressions;
using System.Configuration;
using System.IO;

namespace WFARTHA.Controllers
{
    public class SolicitudesController : Controller
    {
        private WFARTHAEntities db = new WFARTHAEntities();

        // GET: Solicitudes
        public ActionResult Index()
        {
            int pagina = 201; //ID EN BASE DE DATOS
            string spras = "";
            using (WFARTHAEntities db = new WFARTHAEntities())
            {
                string u = User.Identity.Name;
                //string u = "admin";
                var user = db.USUARIOs.Where(a => a.ID.Equals(u)).FirstOrDefault();
                ViewBag.permisos = db.PAGINAVs.Where(a => a.ID.Equals(user.ID)).ToList();
                ViewBag.carpetas = db.CARPETAVs.Where(a => a.USUARIO_ID.Equals(user.ID)).ToList();
                ViewBag.usuario = user;
                ViewBag.returnUrl = Request.Url.PathAndQuery;
                spras = user.SPRAS_ID;
                ViewBag.rol = user.PUESTO.PUESTOTs.Where(a => a.SPRAS_ID.Equals(user.SPRAS_ID)).FirstOrDefault().TXT50;
                ViewBag.Title = db.PAGINAs.Where(a => a.ID.Equals(pagina)).FirstOrDefault().PAGINATs.Where(b => b.SPRAS_ID.Equals(user.SPRAS_ID)).FirstOrDefault().TXT50;
                ViewBag.warnings = db.WARNINGVs.Where(a => (a.PAGINA_ID.Equals(pagina) || a.PAGINA_ID.Equals(0)) && a.SPRAS_ID.Equals(user.SPRAS_ID)).ToList();
                ViewBag.textos = db.TEXTOes.Where(a => (a.PAGINA_ID.Equals(pagina) || a.PAGINA_ID.Equals(0)) && a.SPRAS_ID.Equals(user.SPRAS_ID)).ToList();

                try//Mensaje de documento creado
                {
                    string p = Session["NUM_DOC"].ToString();
                    ViewBag.NUM_DOC = p;
                    Session["NUM_DOC"] = null;
                }
                catch
                {
                    ViewBag.NUM_DOC = "";
                }
            }

            var dOCUMENTOes = db.DOCUMENTOes.Where(a => a.USUARIOC_ID.Equals(User.Identity.Name) | a.USUARIOD_ID.Equals(User.Identity.Name)).ToList();

            dOCUMENTOes = dOCUMENTOes.Distinct(new DocumentoComparer()).ToList();
            return View(dOCUMENTOes);
        }

        // GET: Solicitudes/Details/5
        public ActionResult Details(decimal id)
        {
            int pagina = 203; //ID EN BASE DE DATOS
            FORMATO formato = new FORMATO();
            string spras = "";
            using (WFARTHAEntities db = new WFARTHAEntities())
            {
                string u = User.Identity.Name;
                //string u = "admin";
                var user = db.USUARIOs.Where(a => a.ID.Equals(u)).FirstOrDefault();
                ViewBag.permisos = db.PAGINAVs.Where(a => a.ID.Equals(user.ID)).ToList();
                ViewBag.carpetas = db.CARPETAVs.Where(a => a.USUARIO_ID.Equals(user.ID)).ToList();
                ViewBag.usuario = user;
                ViewBag.returnUrl = Request.Url.PathAndQuery;
                spras = user.SPRAS_ID;
                ViewBag.rol = user.PUESTO.PUESTOTs.Where(a => a.SPRAS_ID.Equals(user.SPRAS_ID)).FirstOrDefault().TXT50;
                ViewBag.Title = db.PAGINAs.Where(a => a.ID.Equals(pagina)).FirstOrDefault().PAGINATs.Where(b => b.SPRAS_ID.Equals(user.SPRAS_ID)).FirstOrDefault().TXT50;
                ViewBag.Title += " ";
                ViewBag.warnings = db.WARNINGVs.Where(a => (a.PAGINA_ID.Equals(pagina) || a.PAGINA_ID.Equals(0)) && a.SPRAS_ID.Equals(user.SPRAS_ID)).ToList();
                ViewBag.textos = db.TEXTOes.Where(a => (a.PAGINA_ID.Equals(pagina) || a.PAGINA_ID.Equals(0)) && a.SPRAS_ID.Equals(user.SPRAS_ID)).ToList();

            }
            if (id == null || id == 0)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DOCUMENTO dOCUMENTO = db.DOCUMENTOes.Find(id);
            if (dOCUMENTO == null)
            {
                return HttpNotFound();
            }

            //Obtener miles y dec
            formato = db.FORMATOes.Where(f => f.ACTIVO == true).FirstOrDefault();
            ViewBag.miles = formato.MILES;
            ViewBag.dec = formato.DECIMALES;

            //Documento a documento mod //Copiar valores del post al nuevo objeto
            DOCUMENTO_MOD doc = new DOCUMENTO_MOD();

            if (dOCUMENTO.DOCUMENTOPs != null)
            {
                List<DOCUMENTOP_MODSTR> dml = new List<DOCUMENTOP_MODSTR>();
                FormatosC fc = new FormatosC();
                //Agregar a documento p_mod para agregar valores faltantes
                for (int i = 0; i < dOCUMENTO.DOCUMENTOPs.Count; i++)
                {
                    DOCUMENTOP_MODSTR dm = new DOCUMENTOP_MODSTR();

                    dm.NUM_DOC = dOCUMENTO.DOCUMENTOPs.ElementAt(i).NUM_DOC;
                    dm.POS = dOCUMENTO.DOCUMENTOPs.ElementAt(i).POS;
                    dm.ACCION = dOCUMENTO.DOCUMENTOPs.ElementAt(i).ACCION;
                    dm.FACTURA = dOCUMENTO.DOCUMENTOPs.ElementAt(i).FACTURA;
                    dm.GRUPO = dOCUMENTO.DOCUMENTOPs.ElementAt(i).GRUPO;
                    dm.CUENTA = dOCUMENTO.DOCUMENTOPs.ElementAt(i).CUENTA;
                    dm.NOMCUENTA = "Transporte";
                    dm.TIPOIMP = dOCUMENTO.DOCUMENTOPs.ElementAt(i).TIPOIMP;
                    dm.IMPUTACION = dOCUMENTO.DOCUMENTOPs.ElementAt(i).IMPUTACION;
                    dm.MONTO = fc.toShow(dOCUMENTO.DOCUMENTOPs.ElementAt(i).MONTO, formato.DECIMALES);
                    dm.IVA = fc.toShow(dOCUMENTO.DOCUMENTOPs.ElementAt(i).IVA, formato.DECIMALES);
                    dm.TEXTO = dOCUMENTO.DOCUMENTOPs.ElementAt(i).TEXTO;
                    dm.TOTAL = fc.toShow(dOCUMENTO.DOCUMENTOPs.ElementAt(i).TOTAL, formato.DECIMALES);

                    dml.Add(dm);
                }

                doc.DOCUMENTOPSTR = dml;
            }

            //Obtener las sociedadess
            //List<SOCIEDAD> sociedadesl = new List<SOCIEDAD>();
            var sociedades = db.SOCIEDADs.Select(s => new { s.BUKRS, TEXT = s.BUKRS + " - " + s.BUTXT }).ToList();
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

            var monedal = db.MONEDAs.Where(m => m.ACTIVO == true).Select(m => new { m.WAERS, TEXT = m.WAERS + " - " + m.LTEXT }).ToList();

            var impuestol = db.IMPUESTOes.Where(i => i.ACTIVO == true).Select(i => new { i.MWSKZ });

            doc.NUM_DOC = dOCUMENTO.NUM_DOC;
            doc.TSOL_ID = dOCUMENTO.TSOL_ID;
            doc.SOCIEDAD_ID = dOCUMENTO.SOCIEDAD_ID;
            doc.FECHAD = dOCUMENTO.FECHAD;
            doc.FECHACON = dOCUMENTO.FECHACON;
            doc.FECHA_BASE = dOCUMENTO.FECHA_BASE;
            doc.MONEDA_ID = dOCUMENTO.MONEDA_ID;
            doc.TIPO_CAMBIO = dOCUMENTO.TIPO_CAMBIO;
            doc.IMPUESTO = dOCUMENTO.IMPUESTO;
            doc.MONTO_DOC_MD = dOCUMENTO.MONTO_DOC_MD;
            doc.REFERENCIA = dOCUMENTO.REFERENCIA;
            doc.CONCEPTO = dOCUMENTO.CONCEPTO;
            doc.PAYER_ID = dOCUMENTO.PAYER_ID;
            doc.CONDICIONES = dOCUMENTO.CONDICIONES;
            doc.TEXTO_POS = dOCUMENTO.TEXTO_POS;
            doc.ASIGNACION_POS = dOCUMENTO.ASIGNACION_POS;
            doc.CLAVE_CTA = dOCUMENTO.CLAVE_CTA;

            ViewBag.SOCIEDAD_ID = new SelectList(sociedades, "BUKRS", "TEXT", doc.SOCIEDAD_ID);
            ViewBag.TSOL_ID = new SelectList(tsoll, "ID", "TEXT", doc.TSOL_ID);
            ViewBag.IMPUESTO = new SelectList(impuestol, "MWSKZ", "MWSKZ", doc.IMPUESTO);
            ViewBag.MONEDA_ID = new SelectList(monedal, "WAERS", "TEXT", doc.MONEDA_ID);

            ViewBag.Title += id;

            List<DOCUMENTOR> retl = new List<DOCUMENTOR>();
            List<DOCUMENTOR_MOD> retlt = new List<DOCUMENTOR_MOD>();

            retl = db.DOCUMENTORs.Where(x => x.NUM_DOC == id).ToList();

            retlt = (from r in retl
                     join rt in db.RETENCIONTs
                     on r.WITHT equals rt.WITHT
                     into jj
                     from rt in jj.DefaultIfEmpty()
                     where rt.SPRAS_ID.Equals("ES")
                     select new DOCUMENTOR_MOD
                     {
                         WITHT = r.WITHT,
                         DESC = rt.TXT50 == null ? String.Empty : "",
                         WT_WITHCD = r.WT_WITHCD,
                         BIMPONIBLE = r.BIMPONIBLE,
                         IMPORTE_RET = r.IMPORTE_RET

                     }).ToList();

            List<DOCUMENTOR_MOD> _relt = new List<DOCUMENTOR_MOD>();
            var _retl = db.RETENCIONs.Where(rt => rt.ESTATUS == true)
                .Join(
                db.RETENCION_PROV.Where(rtp => rtp.LIFNR == dOCUMENTO.PAYER_ID && rtp.BUKRS == dOCUMENTO.SOCIEDAD_ID),
                ret => ret.WITHT,
                retp => retp.WITHT,
                (ret, retp) => new
                {
                    LIFNR = retp.LIFNR,
                    BUKRS = retp.BUKRS,
                    WITHT = retp.WITHT,
                    DESC = ret.DESCRIPCION,
                    WT_WITHCD = retp.WT_WITHCD

                }).ToList();
            if (_retl != null && _retl.Count > 0)
            {
                //Obtener los textos de las retenciones
                _relt = (from r in _retl
                         join rt in db.RETENCIONTs
                         on r.WITHT equals rt.WITHT
                         into jj
                         from rt in jj.DefaultIfEmpty()
                         where rt.SPRAS_ID.Equals("ES")
                         select new DOCUMENTOR_MOD
                         {
                             LIFNR = r.LIFNR,
                             BUKRS = r.BUKRS,
                             WITHT = r.WITHT,
                             WT_WITHCD = r.WT_WITHCD,
                             DESC = rt.TXT50 == null ? String.Empty : r.DESC,

                         }).ToList();
            }
            for (int i = 0; i < _relt.Count; i++)
            {
                var wtht = _relt[i].WITHT;
                var _res = db.DOCUMENTORPs.Where(nd => nd.NUM_DOC == dOCUMENTO.NUM_DOC && nd.WITHT == wtht).FirstOrDefault();
                _relt[i].BIMPONIBLE = _res.BIMPONIBLE;
                _relt[i].IMPORTE_RET = _res.IMPORTE_RET;
            }
            //ViewBag.ret = retlt;
            ViewBag.ret = _relt;

            //Obtener datos del proveedor
            PROVEEDOR prov = db.PROVEEDORs.Where(pr => pr.LIFNR == doc.PAYER_ID).FirstOrDefault();
            ViewBag.prov = prov;

            //LEj 24.09.2018

            var _Se = db.DOCUMENTORPs.Where(x => x.NUM_DOC == id).ToList();
            var rets = _Se.Select(w => w.WITHT).Distinct().ToList();
            var rets2 = rets;
            for (int i = 0; i < rets.Count; i++)
            {
                var _rt = rets2[i];
                var ret = db.RETENCIONs.Where(x => x.WITHT == _rt).FirstOrDefault().WITHT_SUB;
                for (int j = 0; j < rets.Count; j++)
                {
                    if (rets2[j] == ret)
                    {
                        rets2.RemoveAt(j);
                    }
                }
            }
            var _xdocsrp = db.DOCUMENTORPs.Where(x => x.NUM_DOC == id).ToList();
            List<DOCUMENTORP_MOD> _xdocsrp2 = new List<DOCUMENTORP_MOD>();
            DOCUMENTORP_MOD _Data = new DOCUMENTORP_MOD();
            for (int x = 0; x < rets2.Count; x++)
            {
                for (int j = 0; j < _xdocsrp.Count; j++)
                {
                    if (rets2[x] == _xdocsrp[j].WITHT)
                    {
                        _Data = new DOCUMENTORP_MOD();
                        _Data.NUM_DOC = _xdocsrp[j].NUM_DOC;
                        _Data.POS = _xdocsrp[j].POS;
                        _Data.WITHT = _xdocsrp[j].WITHT;
                        _Data.WT_WITHCD = _xdocsrp[j].WT_WITHCD;
                        _Data.BIMPONIBLE = _xdocsrp[j].BIMPONIBLE;
                        _Data.IMPORTE_RET = _xdocsrp[j].IMPORTE_RET;
                        _xdocsrp2.Add(_Data);
                    }
                }
            }
            ViewBag.DocsRp = _xdocsrp2;
            ViewBag.Retenciones = rets2;
            //LEj 24.09.2018---
            return View(doc);
        }

        // GET: Solicitudes/Create
        public ActionResult Create()
        {
            int pagina = 202; //ID EN BASE DE DATOS
            FORMATO formato = new FORMATO();
            string spras = "";
            string user_id = "";//MGC 02-10-2018 Cadena de autorización
            using (WFARTHAEntities db = new WFARTHAEntities())
            {

                string u = User.Identity.Name;
                var user = db.USUARIOs.Where(a => a.ID.Equals(u)).FirstOrDefault();
                ViewBag.permisos = db.PAGINAVs.Where(a => a.ID.Equals(user.ID)).ToList();
                ViewBag.carpetas = db.CARPETAVs.Where(a => a.USUARIO_ID.Equals(user.ID)).ToList();
                ViewBag.usuario = user;
                spras = user.SPRAS_ID;
                user_id = user.ID;//MGC 02-10-2018 Cadena de autorización
                ViewBag.returnUrl = Request.Url.PathAndQuery;
                ViewBag.rol = user.PUESTO.PUESTOTs.Where(a => a.SPRAS_ID.Equals(user.SPRAS_ID)).FirstOrDefault().TXT50;
                ViewBag.Title = db.PAGINAs.Where(a => a.ID.Equals(pagina)).FirstOrDefault().PAGINATs.Where(b => b.SPRAS_ID.Equals(user.SPRAS_ID)).FirstOrDefault().TXT50;
                ViewBag.warnings = db.WARNINGVs.Where(a => (a.PAGINA_ID.Equals(pagina) || a.PAGINA_ID.Equals(0)) && a.SPRAS_ID.Equals(user.SPRAS_ID)).ToList();
                ViewBag.textos = db.TEXTOes.Where(a => (a.PAGINA_ID.Equals(pagina) || a.PAGINA_ID.Equals(0)) && a.SPRAS_ID.Equals(user.SPRAS_ID)).ToList();

                //Obtener miles y dec
                formato = db.FORMATOes.Where(f => f.ACTIVO == true).FirstOrDefault();
                ViewBag.miles = formato.MILES;
                ViewBag.dec = formato.DECIMALES;

            }
            try
            {
                string p = Session["pr"].ToString();
                ViewBag.PrSl = p;
            }
            catch
            {
                //ViewBag.pais = "mx.png";
                return RedirectToAction("Proyectos", "Home", new { returnUrl = Request.Url.AbsolutePath });
            }
            //Obtener las sociedadess
            //List<SOCIEDAD> sociedadesl = new List<SOCIEDAD>();
            var sociedades = db.SOCIEDADs.Select(s => new { s.BUKRS, TEXT = s.BUKRS + " - " + s.BUTXT }).ToList();
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

            var monedal = db.MONEDAs.Where(m => m.ACTIVO == true).Select(m => new { m.WAERS, TEXT = m.WAERS + " - " + m.LTEXT }).ToList();

            //var impuestol = db.IMPUESTOes.Where(i => i.ACTIVO == true).Select(i => new { i.MWSKZ }).ToList();

            var impuestol = (from im in db.IMPUESTOes
                             join imt in db.IMPUESTOTs.Where(imtt => imtt.SPRAS_ID == spras)
                             on im.MWSKZ equals imt.MWSKZ
                             into jj
                             from tt in jj.DefaultIfEmpty()
                             where im.ACTIVO == true
                             select new
                             {
                                 im.MWSKZ,
                                 TEXT = im.MWSKZ + " - " + tt.TXT50
                             }).ToList();

            ViewBag.SOCIEDAD_ID = new SelectList(sociedades, "BUKRS", "TEXT");
            ViewBag.TSOL_ID = new SelectList(tsoll, "ID", "TEXT");
            ViewBag.IMPUESTO = new SelectList(impuestol, "MWSKZ", "TEXT", "V3");
            ViewBag.MONEDA_ID = new SelectList(monedal, "WAERS", "TEXT");
            //lej 30.08.2018------------------
            var xsc = db.SOCIEDADs.ToList();
            var p1 = "";
            if (xsc.Count > 0)
            {
                //saco el primer registro, que sera el que ponga el combobox por default
                p1 = xsc[0].BUKRS;
            }
            var sc = db.SOCIEDADs.Where(x => x.BUKRS == p1).First();
            ViewBag.PROVE = new SelectList(sc.PROVEEDORs, "LIFNR", "LIFNR");

            //MGC 04092018 Conceptos
            //Obtener los valores de los impuestos
            var impl = (from i in db.IMPUESTOes
                        join ii in db.IIMPUESTOes
                        on i.MWSKZ equals ii.MWSKZ
                        where i.ACTIVO == true && ii.ACTIVO == true
                        select new
                        {
                            MWSKZ = ii.MWSKZ,
                            //KSCHL = ii.KSCHL,
                            KBETR = ii.KBETR,
                            ACTIVO = ii.ACTIVO
                        }).ToList();

            var impuestosv = JsonConvert.SerializeObject(impl, Formatting.Indented);
            ViewBag.impuestosval = impuestosv;
            //Workflow
            //ViewBag.worflw = "'aaa','bbb','ccc','ddd','eee'";//lej 10.09.2018
            //Insertar las fechas predefinidas de hoy
            string dates = DateTime.Now.ToString("dd/MM/yyyy");
            DateTime theTime = DateTime.ParseExact(dates, //"06/04/2018 12:00:00 a.m."
                                        "dd/MM/yyyy",
                                        System.Globalization.CultureInfo.InvariantCulture,
                                        System.Globalization.DateTimeStyles.None);

            ViewBag.fechah = theTime.ToString();

            DOCUMENTO_MOD d = new DOCUMENTO_MOD();

            d.FECHAD = theTime;
            d.FECHACON = theTime;
            d.FECHA_BASE = theTime;

            //MGC 02-10-2018 Cadena de autorización
            //List<DET_AGENTECC> dta = new List<DET_AGENTECC>();
            //Falta vigencia
            var dta = db.DET_AGENTECC.Where(dt => dt.USUARIOC_ID == user_id).
                Join(
                db.USUARIOs,
                da => da.USUARIOA_ID,
                us => us.ID,
                (da, us) => new
                {
                    //ID = new List<string>() { da.VERSION, da.USUARIOC_ID, da.ID_RUTA_AGENTE, da.USUARIOA_ID},                    
                    ID = new { VERSION = da.VERSION.ToString().Replace(" ", ""), USUARIOC_ID = da.USUARIOC_ID.ToString().Replace(" ", ""), ID_RUTA_AGENTE = da.ID_RUTA_AGENTE.ToString().Replace(" ", ""), USUARIOA_ID = da.USUARIOA_ID.ToString().Replace(" ", "") },
                    TEXT = us.NOMBRE.ToString() + " " + us.APELLIDO_P.ToString()
                }).ToList();

            ViewBag.DETAA = new SelectList(dta, "ID", "TEXT");

            ViewBag.DETAA2 = JsonConvert.SerializeObject(db.DET_AGENTECC.Where(dt => dt.USUARIOC_ID == user_id).ToList(), Formatting.Indented);

            return View(d);
        }

        // POST: Solicitudes/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "NUM_DOC,NUM_PRE,TSOL_ID,TALL_ID,SOCIEDAD_ID,CANTIDAD_EV,USUARIOC_ID," +
            "USUARIOD_ID,FECHAD,FECHAC,HORAC,FECHAC_PLAN,FECHAC_USER,HORAC_USER,ESTATUS,ESTATUS_C,ESTATUS_SAP,ESTATUS_WF," +
            "DOCUMENTO_REF,CONCEPTO,NOTAS,MONTO_DOC_MD,MONTO_FIJO_MD,MONTO_BASE_GS_PCT_MD,MONTO_BASE_NS_PCT_MD,MONTO_DOC_ML," +
            "MONTO_FIJO_ML,MONTO_BASE_GS_PCT_ML,MONTO_BASE_NS_PCT_ML,MONTO_DOC_ML2,MONTO_FIJO_ML2,MONTO_BASE_GS_PCT_ML2," +
            "MONTO_BASE_NS_PCT_ML2,PORC_ADICIONAL,IMPUESTO,ESTATUS_EXT,PAYER_ID,MONEDA_ID,MONEDAL_ID,MONEDAL2_ID," +
            "TIPO_CAMBIO,TIPO_CAMBIOL,TIPO_CAMBIOL2,NO_FACTURA,FECHAD_SOPORTE,METODO_PAGO,NO_PROVEEDOR,PASO_ACTUAL," +
            "AGENTE_ACTUAL,FECHA_PASO_ACTUAL,PUESTO_ID,GALL_ID,CONCEPTO_ID,DOCUMENTO_SAP,FECHACON,FECHA_BASE,REFERENCIA," +

            "CONDICIONES,TEXTO_POS,ASIGNACION_POS,CLAVE_CTA, DOCUMENTOP,DOCUMENTOR,DOCUMENTORP,Anexo")] Models.DOCUMENTO_MOD doc, IEnumerable<HttpPostedFileBase> file_sopAnexar, string[] labels_desc,
            //MGC 02-10-2018 Cadenas de autorización
            string DETTA_VERSION, string DETTA_USUARIOC_ID, string DETTA_ID_RUTA_AGENTE, string DETTA_USUARIOA_ID)

        {
            int pagina = 202; //ID EN BASE DE DATOS
            string errorString = "";
            FORMATO formato = new FORMATO();
            string spras = "";
            string user_id = ""; //MGC 02-10-2018 Cadenas de autorización
            if (ModelState.IsValid)
            {
                try
                {
                    DOCUMENTO dOCUMENTO = new DOCUMENTO();

                    //Copiar valores del post al nuevo objeto
                    dOCUMENTO.TSOL_ID = doc.TSOL_ID;
                    dOCUMENTO.SOCIEDAD_ID = doc.SOCIEDAD_ID;
                    dOCUMENTO.FECHAD = doc.FECHAD;
                    dOCUMENTO.FECHACON = doc.FECHACON;
                    dOCUMENTO.FECHA_BASE = doc.FECHA_BASE;
                    dOCUMENTO.MONEDA_ID = doc.MONEDA_ID;
                    dOCUMENTO.TIPO_CAMBIO = doc.TIPO_CAMBIO;
                    dOCUMENTO.IMPUESTO = doc.IMPUESTO;
                    dOCUMENTO.MONTO_DOC_MD = doc.MONTO_DOC_MD;
                    //dOCUMENTO.REFERENCIA = doc.REFERENCIA;
                    dOCUMENTO.CONCEPTO = doc.CONCEPTO;
                    dOCUMENTO.PAYER_ID = doc.PAYER_ID;
                    dOCUMENTO.CONDICIONES = doc.CONDICIONES;
                    dOCUMENTO.TEXTO_POS = doc.TEXTO_POS;
                    dOCUMENTO.ASIGNACION_POS = doc.ASIGNACION_POS;
                    dOCUMENTO.CLAVE_CTA = doc.CLAVE_CTA;

                    //B20180625 MGC 2018.06.25
                    //Obtener usuarioc
                    USUARIO us = db.USUARIOs.Find(User.Identity.Name);//RSG 02/05/2018
                    dOCUMENTO.PUESTO_ID = us.PUESTO_ID;//RSG 02/05/2018
                    dOCUMENTO.USUARIOC_ID = User.Identity.Name;


                    //Obtener el rango de números
                    Rangos rangos = new Rangos();//RSG 01.08.2018
                                                 //Obtener el número de documento
                    decimal N_DOC = rangos.getSolID(dOCUMENTO.TSOL_ID);
                    dOCUMENTO.NUM_DOC = N_DOC;
                    //Actualizar el rango
                    rangos.updateRango(dOCUMENTO.TSOL_ID, dOCUMENTO.NUM_DOC);

                    //Referencia
                    dOCUMENTO.REFERENCIA = dOCUMENTO.NUM_DOC.ToString();//LEJ 11.09.2018

                    //Obtener el tipo de documento
                    var doct = db.DET_TIPODOC.Where(dt => dt.TIPO_SOL == doc.TSOL_ID).FirstOrDefault();
                    doc.DOCUMENTO_SAP = doct.BLART;

                    //Fechac
                    dOCUMENTO.FECHAC = DateTime.Now;

                    //Horac
                    dOCUMENTO.HORAC = DateTime.Now.TimeOfDay;

                    //FECHAC_PLAN
                    dOCUMENTO.FECHAC_PLAN = DateTime.Now.Date;

                    //FECHAC_USER
                    dOCUMENTO.FECHAC_USER = DateTime.Now.Date;

                    //HORAC_USER
                    dOCUMENTO.HORAC_USER = DateTime.Now.TimeOfDay;

                    //Estatus
                    dOCUMENTO.ESTATUS = "N";

                    //Estatus wf
                    dOCUMENTO.ESTATUS_WF = "P";

                    db.DOCUMENTOes.Add(dOCUMENTO);
                    db.SaveChanges();//Codigolej

                    doc.NUM_DOC = dOCUMENTO.NUM_DOC;
                    //return RedirectToAction("Index");

                    //Redireccionar al inicio
                    //Guardar número de documento creado
                    Session["NUM_DOC"] = dOCUMENTO.NUM_DOC;

                    //Guardar las posiciones de la solicitud
                    try
                    {
                        int j = 1;
                        for (int i = 0; i < doc.DOCUMENTOP.Count; i++)
                        {
                            try
                            {
                                DOCUMENTOP dp = new DOCUMENTOP();

                                dp.NUM_DOC = doc.NUM_DOC;
                                dp.POS = j;
                                //dp.ACCION = doc.DOCUMENTOP[i].ACCION;
                                dp.ACCION = "D";
                                dp.FACTURA = doc.DOCUMENTOP[i].FACTURA;
                                dp.TCONCEPTO = doc.DOCUMENTOP[i].TCONCEPTO;
                                dp.GRUPO = doc.DOCUMENTOP[i].GRUPO;
                                dp.CUENTA = doc.PAYER_ID;
                                dp.TIPOIMP = doc.DOCUMENTOP[i].TIPOIMP;
                                dp.IMPUTACION = doc.DOCUMENTOP[i].IMPUTACION;
                                dp.CCOSTO = doc.DOCUMENTOP[i].CCOSTO;
                                dp.MONTO = doc.DOCUMENTOP[i].MONTO;
                                var sp = doc.DOCUMENTOP[i].MWSKZ.Split('-');
                                dp.MWSKZ = sp[0];
                                dp.IVA = doc.DOCUMENTOP[i].IVA;
                                dp.TOTAL = doc.DOCUMENTOP[i].TOTAL;
                                dp.TEXTO = doc.DOCUMENTOP[i].TEXTO;
                                db.DOCUMENTOPs.Add(dp);
                                db.SaveChanges();
                            }
                            catch (Exception e)
                            {

                            }

                            j++;
                        }
                    }

                    //Guardar las retenciones de la solicitud

                    catch (Exception e)
                    {
                        errorString = e.Message.ToString();
                        //Guardar número de documento creado

                    }

                    //Lej14.09.2018------
                    try
                    {
                        for (int i = 0; i < doc.DOCUMENTORP.Count; i++)
                        {
                            //cantdidad de renglones añadidos y su posicion
                            var _op = ((i + 2) / 2);
                            var _pos = _op.ToString().Split('.');
                            try
                            {
                                var docr = doc.DOCUMENTOR;
                                var _str = doc.DOCUMENTORP[i].WITHT;
                                var ret = db.RETENCIONs.Where(x => x.WITHT == _str).FirstOrDefault().WITHT_SUB;
                                if (ret != null)
                                {
                                    bool f = false;
                                    for (int _a = 0; _a < docr.Count; _a++)
                                    {
                                        //si encuentra coincidencia
                                        if (docr[_a].WITHT == ret)
                                        {
                                            DOCUMENTORP _dr = new DOCUMENTORP();
                                            _dr.NUM_DOC = doc.NUM_DOC;
                                            _dr.WITHT = doc.DOCUMENTORP[i].WITHT;
                                            _dr.WT_WITHCD = doc.DOCUMENTORP[i].WT_WITHCD;
                                            _dr.POS = int.Parse(_pos[0]);
                                            _dr.BIMPONIBLE = doc.DOCUMENTORP[i].BIMPONIBLE;
                                            _dr.IMPORTE_RET = doc.DOCUMENTORP[i].IMPORTE_RET;
                                            db.DOCUMENTORPs.Add(_dr);
                                            db.SaveChanges();
                                            _dr = new DOCUMENTORP();
                                            _dr.NUM_DOC = doc.NUM_DOC;
                                            _dr.WITHT = docr[_a].WITHT;
                                            _dr.WT_WITHCD = doc.DOCUMENTORP[i].WT_WITHCD;
                                            _dr.POS = int.Parse(_pos[0]);
                                            _dr.BIMPONIBLE = doc.DOCUMENTORP[i].BIMPONIBLE;
                                            _dr.IMPORTE_RET = doc.DOCUMENTORP[i].IMPORTE_RET;
                                            db.DOCUMENTORPs.Add(_dr);
                                            db.SaveChanges();
                                            f = true;
                                        }
                                    }
                                    if (!f)
                                    {
                                        DOCUMENTORP _dr = new DOCUMENTORP();
                                        _dr.NUM_DOC = doc.NUM_DOC;
                                        _dr.WITHT = doc.DOCUMENTORP[i].WITHT;
                                        _dr.WT_WITHCD = doc.DOCUMENTORP[i].WT_WITHCD;
                                        _dr.POS = int.Parse(_pos[0]);
                                        _dr.BIMPONIBLE = doc.DOCUMENTORP[i].BIMPONIBLE;
                                        _dr.IMPORTE_RET = doc.DOCUMENTORP[i].IMPORTE_RET;
                                        db.DOCUMENTORPs.Add(_dr);
                                        db.SaveChanges();
                                    }
                                }
                                else
                                {
                                    DOCUMENTORP dr = new DOCUMENTORP();
                                    dr.NUM_DOC = doc.NUM_DOC;
                                    dr.WITHT = doc.DOCUMENTORP[i].WITHT;
                                    dr.WT_WITHCD = doc.DOCUMENTORP[i].WT_WITHCD;
                                    dr.POS = int.Parse(_pos[0]);
                                    dr.BIMPONIBLE = doc.DOCUMENTORP[i].BIMPONIBLE;
                                    dr.IMPORTE_RET = doc.DOCUMENTORP[i].IMPORTE_RET;
                                    db.DOCUMENTORPs.Add(dr);
                                    db.SaveChanges();
                                }
                            }
                            catch (Exception e)
                            {
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        //
                    }
                    //Lej14.09.2018------

                    try//LEJ 05.09.2018
                    {
                        //Guardar las retenciones de la solicitud
                        for (int i = 0; i < doc.DOCUMENTOR.Count; i++)
                        {
                            if (doc.DOCUMENTOR[i].BUKRS == doc.SOCIEDAD_ID && doc.DOCUMENTOR[i].LIFNR == doc.PAYER_ID)
                            {
                                try
                                {
                                    DOCUMENTOR dr = new DOCUMENTOR();
                                    //dr.NUM_DOC = decimal.Parse(Session["NUM_DOC"].ToString());
                                    dr.NUM_DOC = doc.NUM_DOC;
                                    dr.WITHT = doc.DOCUMENTOR[i].WITHT;
                                    dr.WT_WITHCD = doc.DOCUMENTOR[i].WT_WITHCD;
                                    dr.POS = db.DOCUMENTORs.ToList().Count + 1;
                                    dr.BIMPONIBLE = doc.DOCUMENTOR[i].BIMPONIBLE;
                                    dr.IMPORTE_RET = doc.DOCUMENTOR[i].IMPORTE_RET;
                                    db.DOCUMENTORs.Add(dr);
                                    db.SaveChanges();
                                }
                                catch (Exception e)
                                {
                                }
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        errorString = e.Message.ToString();
                        //Guardar número de documento creado

                    }
                    //Lej26.09.2018------
                    List<string> listaDirectorios = new List<string>();
                    List<string> listaNombreArchivos = new List<string>();
                    List<string> listaDescArchivos = new List<string>();
                    try
                    {
                        //Guardar los documentos cargados en la sección de soporte
                        var res = "";
                        string errorMessage = "";
                        int numFiles = 0;
                        //Checar si hay archivos para subir
                        foreach (HttpPostedFileBase file in file_sopAnexar)
                        {
                            if (file != null)
                            {
                                if (file.ContentLength > 0)
                                {
                                    numFiles++;
                                }
                            }
                        }
                        if (numFiles > 0)
                        {
                            //Obtener las variables con los datos de sesión y ruta
                            string url = ConfigurationManager.AppSettings["URL_Serv"];
                            var bandera = false;
                            try
                            {
                                //WebRequest request = WebRequest.Create(url + "Nueva Carpeta");
                                FtpWebRequest requestDir = (FtpWebRequest)FtpWebRequest.Create(new Uri("ftp://" + url));
                                requestDir.Method = WebRequestMethods.Ftp.MakeDirectory;
                                const string Comillas = "\"";
                                string pwd = "Rumaki,2571" + Comillas + "k41";
                                requestDir.Credentials = new NetworkCredential("luis.gonzalez", pwd);
                                requestDir.UsePassive = true;
                                requestDir.UseBinary = true;
                                requestDir.KeepAlive = false;
                                using (FtpWebResponse response = (FtpWebResponse)requestDir.GetResponse())
                                {
                                    var xpr = response.StatusCode;
                                }
                                //Stream ftpStream = response.GetResponseStream();
                                //ftpStream.Close();
                                // response.Close();
                                bandera = true;
                            }
                            catch (WebException ex)
                            {
                                FtpWebResponse response = (FtpWebResponse)ex.Response;
                                if (response.StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                                {
                                    response.Close();
                                    bandera = true;
                                }
                                else
                                {
                                    response.Close();
                                    bandera = false;
                                }
                            }
                            //WebRequest request = WebRequest.Create("ftp://192.168.32.207/NuevaCarpeta");
                            //request.Method = WebRequestMethods.Ftp.MakeDirectory;
                            //const string Comillas = "\"";
                            //string pwd = "Rumaki,2571" + Comillas + "k41";
                            //request.Credentials = new NetworkCredential("luis.gonzalez", pwd);

                            //using (var resp = (FtpWebResponse)request.GetResponse())
                            //{
                            //    var xpr = resp.StatusCode;
                            // }


                            //Evaluar que se creo el directorio
                            if (bandera)
                            {
                                int indexlabel = 0;
                                foreach (HttpPostedFileBase file in file_sopAnexar)
                                {
                                    var descripcion = "";
                                    try
                                    {
                                        listaDescArchivos.Add(labels_desc[indexlabel]);
                                    }
                                    catch (Exception ex)
                                    {
                                        descripcion = "";
                                        listaDescArchivos.Add(descripcion);
                                    }
                                    try
                                    {
                                        listaNombreArchivos.Add(file.FileName);
                                    }
                                    catch (Exception ex)
                                    {
                                        listaDescArchivos.Add("");
                                    }
                                    string errorfiles = "";
                                    if (file != null)
                                    {
                                        if (file.ContentLength > 0)
                                        {
                                            string path = "";
                                            string filename = file.FileName;
                                            errorfiles = "";
                                            res = SaveFile(file, url);
                                            listaDirectorios.Add(res);
                                            if (errorfiles == "")
                                            {
                                                //DOCUMENTOA _doc = new DOCUMENTOA();
                                                //var ext = System.IO.Path.GetExtension(filename);
                                                //_doc.NUM_DOC = dOCUMENTO.NUM_DOC;
                                                //_doc.POSD = 1;
                                                //_doc.POS = db.DOCUMENTOAs.ToList().Count + 1;
                                                //_doc.TIPO = ext.Replace(".", "");
                                                //_doc.DESC = descripcion;

                                                //try
                                                //{
                                                //    // var clasefileM = clasefile.ToUpper();
                                                //    _doc.CLASE = "OTR";
                                                //}
                                                //catch (Exception e)
                                                //{
                                                //    _doc.CLASE = "";
                                                //}
                                                //_doc.STEP_WF = 1;
                                                //_doc.USUARIO_ID = dOCUMENTO.USUARIOC_ID;
                                                //_doc.PATH = path;
                                                //_doc.ACTIVO = true;
                                                //try
                                                //{
                                                //    db.DOCUMENTOAs.Add(_doc);
                                                //    db.SaveChanges();
                                                //}
                                                //catch (Exception e)
                                                //{
                                                //    errorfiles = "" + filename;
                                                //}

                                            }
                                        }
                                    }
                                    indexlabel++;
                                    if (errorfiles != "")
                                    {
                                        errorMessage += "Error con el archivo " + errorfiles;
                                    }
                                }
                            }
                            else
                            {
                                // errorMessage = dir;
                            }

                            errorString = errorMessage;
                            //Guardar número de documento creado
                            Session["ERROR_FILES"] = errorMessage;
                        }
                    }
                    catch (Exception e)
                    {

                    }
                    //Lej26.09.2018------

                    //MGC 02-10-2018 Cadena de autorización work flow --->
                    //Flujo
                    ProcesaFlujo pf = new ProcesaFlujo();
                    //Comienza el wf
                    //Se obtiene la cabecera
                    try
                    {
                        WORKFV wf = db.WORKFHs.Where(a => a.TSOL_ID.Equals(dOCUMENTO.TSOL_ID)).FirstOrDefault().WORKFVs.OrderByDescending(a => a.VERSION).FirstOrDefault();

                        DET_AGENTECC deta = new DET_AGENTECC();
                        try
                        {
                            deta.VERSION = Convert.ToInt32(DETTA_VERSION);
                        }
                        catch (Exception e)
                        {

                        }

                        try
                        {
                            deta.USUARIOC_ID = DETTA_USUARIOC_ID;
                        }
                        catch (Exception e)
                        {

                        }


                        try
                        {
                            deta.ID_RUTA_AGENTE = DETTA_ID_RUTA_AGENTE;
                        }
                        catch (Exception e)
                        {

                        }

                        try
                        {
                            deta.USUARIOA_ID = DETTA_USUARIOA_ID;
                        }
                        catch (Exception e)
                        {

                        }

                        if (wf != null)
                        {
                            WORKFP wp = wf.WORKFPs.OrderBy(a => a.POS).FirstOrDefault();
                            FLUJO f = new FLUJO();
                            f.WORKF_ID = wf.ID;
                            f.WF_VERSION = wf.VERSION;
                            f.WF_POS = wp.POS;
                            f.NUM_DOC = dOCUMENTO.NUM_DOC;
                            f.POS = 1;
                            f.LOOP = 1;
                            f.USUARIOA_ID = dOCUMENTO.USUARIOC_ID;
                            f.USUARIOD_ID = dOCUMENTO.USUARIOD_ID;
                            f.ESTATUS = "I";
                            f.FECHAC = DateTime.Now;
                            f.FECHAM = DateTime.Now;
                            f.STEP_AUTO = 0;

                            //Ruta tomada
                            f.ID_RUTA_A = deta.ID_RUTA_AGENTE;
                            f.RUTA_VERSION = deta.VERSION;

                            string c = pf.procesa(f, "");
                            //while (c == "1")
                            //{
                            //    Email em = new Email();
                            //    string UrlDirectory = Request.Url.GetLeftPart(UriPartial.Path);
                            //    string image = Server.MapPath("~/images/logo_kellogg.png");
                            //    em.enviaMailC(f.NUM_DOC, true, Session["spras"].ToString(), UrlDirectory, "Index", image);

                            //    FLUJO conta = db.FLUJOes.Where(x => x.NUM_DOC == f.NUM_DOC).Include(x => x.WORKFP).OrderByDescending(x => x.POS).FirstOrDefault();
                            //    if (conta.WORKFP.ACCION.TIPO == "B")
                            //    {
                            //        WORKFP wpos = db.WORKFPs.Where(x => x.ID == conta.WORKF_ID & x.VERSION == conta.WF_VERSION & x.POS == conta.WF_POS).FirstOrDefault();
                            //        //FLUJO f1 = new FLUJO();
                            //        //f1.WORKF_ID = conta.WORKF_ID;
                            //        //f1.WF_VERSION = conta.WF_VERSION;
                            //        //f1.WF_POS = (int)wpos.NEXT_STEP;
                            //        //f1.NUM_DOC = dOCUMENTO.NUM_DOC;
                            //        //f1.POS = conta.POS + 1;
                            //        //f1.LOOP = 1;
                            //        ////f1.USUARIOA_ID = dOCUMENTO.USUARIOC_ID;
                            //        ////f1.USUARIOD_ID = dOCUMENTO.USUARIOD_ID;
                            //        conta.ESTATUS = "A";
                            //        //f1.FECHAC = DateTime.Now;
                            //        conta.FECHAM = DateTime.Now;
                            //        c = pf.procesa(conta, "");
                            //    }
                            //    else
                            //    {
                            //        c = "";
                            //    }
                            //}

                        }

                    }
                    catch (Exception ee)
                    {
                        if (errorString == "")
                        {
                            errorString = ee.Message.ToString();
                        }
                        ViewBag.error = errorString;
                    }
                    //MGC 02-10-2018 Cadena de autorización work flow <---

                    //Lej-02.10.2018------
                    //DOCUMENTOA
                    //Misma cantidad de archivos y nombres, osea todo bien
                    if (listaDirectorios.Count == listaDescArchivos.Count && listaDirectorios.Count == listaNombreArchivos.Count)
                    {
                        for (int i = 0; i < doc.Anexo.Count; i++)
                        {
                            var pos = 1;
                            DOCUMENTOA _dA = new DOCUMENTOA();
                            if (doc.Anexo[i].a1 != 0)
                            {
                                _dA.NUM_DOC = doc.NUM_DOC;
                                _dA.POSD = i + 1;
                                _dA.POS = pos;
                                //Compruebo que el numero este dentro de los rangos de anexos MAXIMO 5
                                if (doc.Anexo[i].a1 > 0 && doc.Anexo[i].a1 <= listaNombreArchivos.Count)
                                {
                                    try
                                    {
                                        var de = Path.GetExtension(listaNombreArchivos[doc.Anexo[i].a1]);
                                        _dA.TIPO = de.Replace(".", "");
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.TIPO = "";
                                    }
                                    try
                                    {
                                        _dA.DESC = listaDescArchivos[doc.Anexo[i].a1];
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.DESC = "";
                                    }
                                    try
                                    {
                                        _dA.PATH = listaDirectorios[doc.Anexo[i].a1];
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.PATH = "";
                                    }
                                }
                                else
                                {
                                    _dA.TIPO = "";
                                    _dA.DESC = "";
                                    _dA.PATH = "";
                                }
                                _dA.CLASE = "OTR";
                                _dA.STEP_WF = 1;
                                _dA.USUARIO_ID = dOCUMENTO.USUARIOC_ID;
                                _dA.ACTIVO = true;
                                try
                                {
                                    db.DOCUMENTOAs.Add(_dA);
                                    db.SaveChanges();
                                    pos++;
                                }
                                catch (Exception e)
                                {
                                    //
                                }
                            }
                            _dA = new DOCUMENTOA();
                            if (doc.Anexo[i].a2 != 0)
                            {
                                _dA.NUM_DOC = doc.NUM_DOC;
                                _dA.POSD = i + 1;
                                _dA.POS = pos;
                                //Compruebo que el numero este dentro de los rangos de anexos MAXIMO 5
                                if (doc.Anexo[i].a2 > 0 && doc.Anexo[i].a2 <= listaNombreArchivos.Count)
                                {
                                    try
                                    {
                                        var de = Path.GetExtension(listaNombreArchivos[doc.Anexo[i].a2]);
                                        _dA.TIPO = de.Replace(".", "");
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.TIPO = "";
                                    }
                                    try
                                    {
                                        _dA.DESC = listaDescArchivos[doc.Anexo[i].a2];
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.DESC = "";
                                    }
                                    try
                                    {
                                        _dA.PATH = listaDirectorios[doc.Anexo[i].a2];
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.PATH = "";
                                    }
                                }
                                else
                                {
                                    _dA.TIPO = "";
                                    _dA.DESC = "";
                                    _dA.PATH = "";
                                }
                                _dA.CLASE = "OTR";
                                _dA.STEP_WF = 1;
                                _dA.USUARIO_ID = dOCUMENTO.USUARIOC_ID;
                                _dA.ACTIVO = true;
                                try
                                {
                                    db.DOCUMENTOAs.Add(_dA);
                                    db.SaveChanges();
                                    pos++;
                                }
                                catch (Exception e)
                                {
                                    //
                                }
                            }
                            _dA = new DOCUMENTOA();
                            if (doc.Anexo[i].a3 != 0)
                            {
                                _dA.NUM_DOC = doc.NUM_DOC;
                                _dA.POSD = i + 1;
                                _dA.POS = pos;
                                //Compruebo que el numero este dentro de los rangos de anexos MAXIMO 5
                                if (doc.Anexo[i].a3 > 0 && doc.Anexo[i].a3 <= listaNombreArchivos.Count)
                                {
                                    try
                                    {
                                        var de = Path.GetExtension(listaNombreArchivos[doc.Anexo[i].a3]);
                                        _dA.TIPO = de.Replace(".", "");
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.TIPO = "";
                                    }
                                    try
                                    {
                                        _dA.DESC = listaDescArchivos[doc.Anexo[i].a3];
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.DESC = "";
                                    }
                                    try
                                    {
                                        _dA.PATH = listaDirectorios[doc.Anexo[i].a3];
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.PATH = "";
                                    }
                                }
                                else
                                {
                                    _dA.TIPO = "";
                                    _dA.DESC = "";
                                    _dA.PATH = "";
                                }
                                _dA.CLASE = "OTR";
                                _dA.STEP_WF = 1;
                                _dA.USUARIO_ID = dOCUMENTO.USUARIOC_ID;
                                _dA.ACTIVO = true;
                                try
                                {
                                    db.DOCUMENTOAs.Add(_dA);
                                    db.SaveChanges();
                                    pos++;
                                }
                                catch (Exception e)
                                {
                                    //
                                }
                            }
                            _dA = new DOCUMENTOA();
                            if (doc.Anexo[i].a4 != 0)
                            {
                                _dA.NUM_DOC = doc.NUM_DOC;
                                _dA.POSD = i + 1;
                                _dA.POS = pos;
                                //Compruebo que el numero este dentro de los rangos de anexos MAXIMO 5
                                if (doc.Anexo[i].a4 > 0 && doc.Anexo[i].a4 <= listaNombreArchivos.Count)
                                {
                                    try
                                    {
                                        var de = Path.GetExtension(listaNombreArchivos[doc.Anexo[i].a4]);
                                        _dA.TIPO = de.Replace(".", "");
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.TIPO = "";
                                    }
                                    try
                                    {
                                        _dA.DESC = listaDescArchivos[doc.Anexo[i].a4];
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.DESC = "";
                                    }
                                    try
                                    {
                                        _dA.PATH = listaDirectorios[doc.Anexo[i].a4];
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.PATH = "";
                                    }
                                }
                                else
                                {
                                    _dA.TIPO = "";
                                    _dA.DESC = "";
                                    _dA.PATH = "";
                                }
                                _dA.CLASE = "OTR";
                                _dA.STEP_WF = 1;
                                _dA.USUARIO_ID = dOCUMENTO.USUARIOC_ID;
                                _dA.ACTIVO = true;
                                try
                                {
                                    db.DOCUMENTOAs.Add(_dA);
                                    db.SaveChanges();
                                    pos++;
                                }
                                catch (Exception e)
                                {
                                    //
                                }
                            }
                            _dA = new DOCUMENTOA();
                            if (doc.Anexo[i].a5 != 0)
                            {
                                _dA.NUM_DOC = doc.NUM_DOC;
                                _dA.POSD = i + 1;
                                _dA.POS = pos;
                                //Compruebo que el numero este dentro de los rangos de anexos MAXIMO 5
                                if (doc.Anexo[i].a5 > 0 && doc.Anexo[i].a5 <= listaNombreArchivos.Count)
                                {
                                    try
                                    {
                                        var de = Path.GetExtension(listaNombreArchivos[doc.Anexo[i].a5]);
                                        _dA.TIPO = de.Replace(".", "");
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.TIPO = "";
                                    }
                                    try
                                    {
                                        _dA.DESC = listaDescArchivos[doc.Anexo[i].a5];
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.DESC = "";
                                    }
                                    try
                                    {
                                        _dA.PATH = listaDirectorios[doc.Anexo[i].a5];
                                    }
                                    catch (Exception c)
                                    {
                                        _dA.PATH = "";
                                    }
                                }
                                else
                                {
                                    _dA.TIPO = "";
                                    _dA.DESC = "";
                                    _dA.PATH = "";
                                }
                                _dA.CLASE = "OTR";
                                _dA.STEP_WF = 1;
                                _dA.USUARIO_ID = dOCUMENTO.USUARIOC_ID;
                                _dA.ACTIVO = true;
                                try
                                {
                                    db.DOCUMENTOAs.Add(_dA);
                                    db.SaveChanges();
                                    pos++;
                                }
                                catch (Exception e)
                                {
                                    //
                                }
                            }
                        }
                    }
                    //Lej-02.10.2018------

                }
                catch (Exception e)
                {
                    errorString += e.Message.ToString();
                }


                return RedirectToAction("Index", "Home");
            }
            else
            {

                string validationErrors = string.Join(",",
                    ModelState.Values.Where(E => E.Errors.Count > 0)
                    .SelectMany(E => E.Errors)
                    .Select(E => E.ErrorMessage)
                    .ToArray());

                errorString += validationErrors;
            }
            ViewBag.error = errorString;

            string u = User.Identity.Name;
            var user = db.USUARIOs.Where(a => a.ID.Equals(u)).FirstOrDefault();
            ViewBag.permisos = db.PAGINAVs.Where(a => a.ID.Equals(user.ID)).ToList();
            ViewBag.carpetas = db.CARPETAVs.Where(a => a.USUARIO_ID.Equals(user.ID)).ToList();
            ViewBag.usuario = user;
            spras = user.SPRAS_ID;
            ViewBag.returnUrl = Request.Url.PathAndQuery;
            ViewBag.rol = user.PUESTO.PUESTOTs.Where(a => a.SPRAS_ID.Equals(user.SPRAS_ID)).FirstOrDefault().TXT50;
            ViewBag.Title = db.PAGINAs.Where(a => a.ID.Equals(pagina)).FirstOrDefault().PAGINATs.Where(b => b.SPRAS_ID.Equals(user.SPRAS_ID)).FirstOrDefault().TXT50;
            ViewBag.warnings = db.WARNINGVs.Where(a => (a.PAGINA_ID.Equals(pagina) || a.PAGINA_ID.Equals(0)) && a.SPRAS_ID.Equals(user.SPRAS_ID)).ToList();
            ViewBag.textos = db.TEXTOes.Where(a => (a.PAGINA_ID.Equals(pagina) || a.PAGINA_ID.Equals(0)) && a.SPRAS_ID.Equals(user.SPRAS_ID)).ToList();

            //Obtener miles y dec
            formato = db.FORMATOes.Where(f => f.ACTIVO == true).FirstOrDefault();
            ViewBag.miles = formato.MILES;
            ViewBag.dec = formato.DECIMALES;

            //Obtener las sociedadess
            //List<SOCIEDAD> sociedadesl = new List<SOCIEDAD>();
            var sociedades = db.SOCIEDADs.Select(s => new { s.BUKRS, TEXT = s.BUKRS + " - " + s.BUTXT }).ToList();
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

            var monedal = db.MONEDAs.Where(m => m.ACTIVO == true).Select(m => new { m.WAERS, TEXT = m.WAERS + " - " + m.LTEXT }).ToList();

            var impuestol = db.IMPUESTOes.Where(i => i.ACTIVO == true).Select(i => new { i.MWSKZ });

            ViewBag.SOCIEDAD_ID = new SelectList(sociedades, "BUKRS", "TEXT", doc.SOCIEDAD_ID);
            ViewBag.TSOL_ID = new SelectList(tsoll, "ID", "TEXT", doc.TSOL_ID);
            ViewBag.IMPUESTO = new SelectList(impuestol, "MWSKZ", "MWSKZ", doc.IMPUESTO);
            ViewBag.MONEDA_ID = new SelectList(monedal, "WAERS", "TEXT", doc.MONEDA_ID);

            return View(doc);
        }



        // GET: Solicitudes/Edit/5
        public ActionResult Edit(decimal id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DOCUMENTO dOCUMENTO = db.DOCUMENTOes.Find(id);
            if (dOCUMENTO == null)
            {
                return HttpNotFound();
            }
            ViewBag.SOCIEDAD_ID = new SelectList(db.SOCIEDADs, "BUKRS", "BUTXT", dOCUMENTO.SOCIEDAD_ID);
            ViewBag.TSOL_ID = new SelectList(db.TSOLs, "ID", "DESCRIPCION", dOCUMENTO.TSOL_ID);
            ViewBag.USUARIOC_ID = new SelectList(db.USUARIOs, "ID", "PASS", dOCUMENTO.USUARIOC_ID);
            return View(dOCUMENTO);
        }

        // POST: Solicitudes/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "NUM_DOC,NUM_PRE,TSOL_ID,TALL_ID,SOCIEDAD_ID,PAIS_ID,ESTADO,CIUDAD,PERIODO,EJERCICIO,TIPO_TECNICO,TIPO_RECURRENTE,CANTIDAD_EV,USUARIOC_ID,USUARIOD_ID,FECHAD,FECHAC,HORAC,FECHAC_PLAN,FECHAC_USER,HORAC_USER,ESTATUS,ESTATUS_C,ESTATUS_SAP,ESTATUS_WF,DOCUMENTO_REF,CONCEPTO,NOTAS,MONTO_DOC_MD,MONTO_FIJO_MD,MONTO_BASE_GS_PCT_MD,MONTO_BASE_NS_PCT_MD,MONTO_DOC_ML,MONTO_FIJO_ML,MONTO_BASE_GS_PCT_ML,MONTO_BASE_NS_PCT_ML,MONTO_DOC_ML2,MONTO_FIJO_ML2,MONTO_BASE_GS_PCT_ML2,MONTO_BASE_NS_PCT_ML2,PORC_ADICIONAL,IMPUESTO,FECHAI_VIG,FECHAF_VIG,ESTATUS_EXT,SOLD_TO_ID,PAYER_ID,PAYER_NOMBRE,PAYER_EMAIL,GRUPO_CTE_ID,CANAL_ID,MONEDA_ID,MONEDAL_ID,MONEDAL2_ID,TIPO_CAMBIO,TIPO_CAMBIOL,TIPO_CAMBIOL2,NO_FACTURA,FECHAD_SOPORTE,METODO_PAGO,NO_PROVEEDOR,PASO_ACTUAL,AGENTE_ACTUAL,FECHA_PASO_ACTUAL,VKORG,VTWEG,SPART,PUESTO_ID,GALL_ID,CONCEPTO_ID,DOCUMENTO_SAP,PORC_APOYO,LIGADA,OBJETIVOQ,FRECUENCIA_LIQ,OBJQ_PORC,FECHACON,FECHA_BASE,REFERENCIA,TEXTO_POS,ASIGNACION_POS,CLAVE_CTA,MONTO_DOC_IMP")] DOCUMENTO dOCUMENTO)
        {
            if (ModelState.IsValid)
            {
                db.Entry(dOCUMENTO).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.SOCIEDAD_ID = new SelectList(db.SOCIEDADs, "BUKRS", "BUTXT", dOCUMENTO.SOCIEDAD_ID);
            ViewBag.TSOL_ID = new SelectList(db.TSOLs, "ID", "DESCRIPCION", dOCUMENTO.TSOL_ID);
            ViewBag.USUARIOC_ID = new SelectList(db.USUARIOs, "ID", "PASS", dOCUMENTO.USUARIOC_ID);
            return View(dOCUMENTO);
        }

        // GET: Solicitudes/Delete/5
        public ActionResult Delete(decimal id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DOCUMENTO dOCUMENTO = db.DOCUMENTOes.Find(id);
            if (dOCUMENTO == null)
            {
                return HttpNotFound();
            }
            return View(dOCUMENTO);
        }

        // POST: Solicitudes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(decimal id)
        {
            DOCUMENTO dOCUMENTO = db.DOCUMENTOes.Find(id);
            db.DOCUMENTOes.Remove(dOCUMENTO);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        [HttpPost]
        public ActionResult getPartialCon(List<DOCUMENTOP_MOD> docs)
        {
            DOCUMENTO_MOD doc = new DOCUMENTO_MOD();

            doc.DOCUMENTOP = docs;
            return PartialView("~/Views/Solicitudes/_PartialConTr.cshtml", doc);
        }

        [HttpPost]
        public ActionResult getPartialCon2(List<DOCUMENTORP_MOD> docs)
        {
            DOCUMENTO_MOD doc = new DOCUMENTO_MOD();
            doc.DOCUMENTORP = docs;
            return PartialView("~/Views/Solicitudes/_PartialConTr2.cshtml", doc);
        }

        [HttpPost]
        public ActionResult getPartialCon3(List<Anexo> docs)
        {
            DOCUMENTO_MOD doc = new DOCUMENTO_MOD();
            doc.Anexo = docs;
            return PartialView("~/Views/Solicitudes/_PartialConTr3.cshtml", doc);
        }

        [HttpPost]
        public ActionResult getPartialRet(List<DOCUMENTOR_MOD> docs)
        {
            DOCUMENTO_MOD doc = new DOCUMENTO_MOD();
            var nd = docs[0].BIMPONIBLE;
            doc.DOCUMENTOR = docs;
            return PartialView("~/Views/Solicitudes/_PartialRetTr.cshtml", doc);
        }

        [HttpPost]
        public JsonResult getRetenciones(List<DOCUMENTOR_MOD> items, string bukrs, string lifnr)
        {

            List<DOCUMENTOR_MOD> retlt = new List<DOCUMENTOR_MOD>();
            //Obtener las retenciones a partir del proveedor y sociedad
            var retl = db.RETENCIONs.Where(rt => rt.ESTATUS == true)
                .Join(
                db.RETENCION_PROV.Where(rtp => rtp.LIFNR == lifnr && rtp.BUKRS == bukrs),
                ret => ret.WITHT,
                retp => retp.WITHT,
                (ret, retp) => new
                {
                    LIFNR = retp.LIFNR,
                    BUKRS = retp.BUKRS,
                    WITHT = retp.WITHT,
                    DESC = ret.DESCRIPCION,
                    WT_WITHCD = retp.WT_WITHCD

                }).ToList();

            if (retl != null && retl.Count > 0)
            {
                //Obtener los textos de las retenciones
                retlt = (from r in retl
                         join rt in db.RETENCIONTs
                         on r.WITHT equals rt.WITHT
                         into jj
                         from rt in jj.DefaultIfEmpty()
                         where rt.SPRAS_ID.Equals("ES")
                         select new DOCUMENTOR_MOD
                         {
                             LIFNR = r.LIFNR,
                             BUKRS = r.BUKRS,
                             WITHT = r.WITHT,
                             WT_WITHCD = r.WT_WITHCD,
                             DESC = rt.TXT50 == null ? String.Empty : r.DESC,

                         }).ToList();
            }


            foreach (DOCUMENTOR_MOD it in retlt)
            {
                //Buscar si los registros que se obtuvieron, están en la lista de la vista
                DOCUMENTOR_MOD doco = new DOCUMENTOR_MOD();
                try
                {
                    doco = items.Where(m => m.LIFNR == it.LIFNR && m.BUKRS == it.BUKRS && m.WITHT == it.WITHT && m.WT_WITHCD == it.WT_WITHCD).FirstOrDefault();
                }
                catch (Exception e)
                {

                }

                if (doco != null)
                {
                    it.IMPORTE_RET = doco.IMPORTE_RET;
                    it.BIMPONIBLE = doco.BIMPONIBLE;
                }
            }

            JsonResult jc = Json(retlt, JsonRequestBehavior.AllowGet);
            return jc;
        }

        [HttpPost]
        public JsonResult getConcepto(string id, string tipo, string bukrs)
        {

            //Obtener el concepto
            CONCEPTO c = new CONCEPTO();

            c = db.CONCEPTOes.Where(co => co.ID_CONCEPTO == id && co.TIPO_CONCEPTO == tipo).FirstOrDefault();

            JsonResult jc = Json(c, JsonRequestBehavior.AllowGet);
            return jc;
        }

        [HttpPost]
        public JsonResult getPercentage(string witht)
        {
            //Obtener el concepto
            decimal porc = 0;

            porc = db.RETENCIONs.Where(co => co.WITHT == witht).FirstOrDefault().PORC;

            JsonResult jc = Json(porc, JsonRequestBehavior.AllowGet);
            return jc;
        }

        [HttpPost]
        public JsonResult getConceptoI(string Prefix, string bukrs)
        {

            if (Prefix == null)
                Prefix = "";

            WFARTHAEntities db = new WFARTHAEntities();

            //Obtener el tipo de operación de usuario
            string u = User.Identity.Name;
            var user = db.USUARIOs.Where(a => a.ID.Equals(u)).Include(usr => usr.DET_TIPOPRESUPUESTO).FirstOrDefault();

            DET_TIPOPRESUPUESTO tp = new DET_TIPOPRESUPUESTO();

            //Veridficar si hay tipo presupuesto
            if (user != null && user.DET_TIPOPRESUPUESTO.Count > 0)
            {
                try
                {
                    tp = user.DET_TIPOPRESUPUESTO.Where(t => t.BUKRS == bukrs).FirstOrDefault();
                }
                catch (Exception e)
                {

                }
            }
            var lcont = (dynamic)null;

            //Tiene un tipo de presupuesto
            if (tp != null && tp.TIPOPRE != "" && tp.TIPOPRE != null)
            {

                if (tp.TIPOPRE != "*")
                {
                    ////Obtener todos los elementos k-------------------------------------------------------------------------------------
                    //var lconk = (from co in db.CONCEPTOes
                    //             where co.ID_CONCEPTO.Contains(Prefix) && co.TIPO_PRESUPUESTO == tp.TIPOPRE && co.TIPO_IMPUTACION == "K"
                    //             select new
                    //             {
                    //                 ID_CONCEPTO = co.ID_CONCEPTO.ToString(),
                    //                 TIPO_CONCEPTO = co.TIPO_CONCEPTO.ToString(),
                    //                 DESC_CONCEPTO = co.DESC_CONCEPTO.ToString()
                    //             }).ToList();

                    //if (lconk.Count == 0)
                    //{
                    //    var lconk2 = (from co in db.CONCEPTOes.ToList()
                    //                  where co.DESC_CONCEPTO.Contains(Prefix) && co.TIPO_PRESUPUESTO == tp.TIPOPRE && co.TIPO_IMPUTACION == "K"
                    //                 select new
                    //                 {
                    //                     ID_CONCEPTO = co.ID_CONCEPTO.ToString(),
                    //                     TIPO_CONCEPTO = co.TIPO_CONCEPTO.ToString(),
                    //                     DESC_CONCEPTO = co.DESC_CONCEPTO.ToString()
                    //                 }).ToList();

                    //    lconk.AddRange(lconk2);
                    //}

                    //lcont.AddRange(lconk);

                    //Obtener todos los elementos k-------------------------------------------------------------------------------------

                    //Obtener los elementos asignados al proyecto RE-00900
                    List<DET_PEP> detpep = new List<DET_PEP>();
                    detpep = db.DET_PEP.Where(dp => dp.PSPNR == "RE-00900").ToList();

                    var lcon = (from co in db.CONCEPTOes.ToList()
                                join dp in detpep
                                on new { A = co.ID_CONCEPTO, B = co.TIPO_CONCEPTO } equals new { A = dp.CONCEPTO, B = dp.TIPO_CONCEPTO } //
                                where co.ID_CONCEPTO.Contains(Prefix) && co.TIPO_PRESUPUESTO == tp.TIPOPRE
                                select new
                                {
                                    ID_CONCEPTO = co.ID_CONCEPTO.ToString(),
                                    TIPO_CONCEPTO = co.TIPO_CONCEPTO.ToString(),
                                    DESC_CONCEPTO = co.DESC_CONCEPTO.ToString()
                                }).ToList();

                    if (lcon.Count == 0)
                    {
                        var lcon2 = (from co in db.CONCEPTOes.ToList()
                                     join dp in detpep
                                     on new { A = co.ID_CONCEPTO, B = co.TIPO_CONCEPTO } equals new { A = dp.CONCEPTO, B = dp.TIPO_CONCEPTO } //
                                     where co.DESC_CONCEPTO.Contains(Prefix) && co.TIPO_PRESUPUESTO == tp.TIPOPRE
                                     select new
                                     {
                                         ID_CONCEPTO = co.ID_CONCEPTO.ToString(),
                                         TIPO_CONCEPTO = co.TIPO_CONCEPTO.ToString(),
                                         DESC_CONCEPTO = co.DESC_CONCEPTO.ToString()
                                     }).ToList();

                        lcon.AddRange(lcon2);
                    }

                    lcont = lcon;
                }
                else
                {
                    var lcont2 = (dynamic)null;
                    //Obtener todos los elementos k-------------------------------------------------------------------------------------
                    //var lconk = (from co in db.CONCEPTOes
                    //             where co.ID_CONCEPTO.Contains(Prefix) && co.TIPO_IMPUTACION == "K"
                    //             select new
                    //             {
                    //                 ID_CONCEPTO = co.ID_CONCEPTO.ToString(),
                    //                 TIPO_CONCEPTO = co.TIPO_CONCEPTO.ToString(),
                    //                 DESC_CONCEPTO = co.DESC_CONCEPTO.ToString()
                    //             }).ToList();

                    //if(lconk.Count == 0)
                    //{
                    //    var lconk2 = (from co in db.CONCEPTOes
                    //                 where co.DESC_CONCEPTO.Contains(Prefix) && co.TIPO_IMPUTACION == "K"
                    //                 select new
                    //                 {
                    //                     ID_CONCEPTO = co.ID_CONCEPTO.ToString(),
                    //                     TIPO_CONCEPTO = co.TIPO_CONCEPTO.ToString(),
                    //                     DESC_CONCEPTO = co.DESC_CONCEPTO.ToString()
                    //                 }).ToList();

                    //    lconk.AddRange(lconk2);
                    //}


                    //lcont2.
                    //Obtener todos los elementos k-------------------------------------------------------------------------------------

                    //Obtener los elementos asignados al proyecto RE-00900
                    List<DET_PEP> detpep = new List<DET_PEP>();
                    detpep = db.DET_PEP.Where(dp => dp.PSPNR == "RE-00900").ToList();

                    var lcon = (from co in db.CONCEPTOes.ToList()
                                join dp in detpep
                                     on new { A = co.ID_CONCEPTO, B = co.TIPO_CONCEPTO } equals new { A = dp.CONCEPTO, B = dp.TIPO_CONCEPTO } //
                                where co.ID_CONCEPTO.Contains(Prefix)
                                select new
                                {
                                    ID_CONCEPTO = co.ID_CONCEPTO.ToString(),
                                    TIPO_CONCEPTO = co.TIPO_CONCEPTO.ToString(),
                                    DESC_CONCEPTO = co.DESC_CONCEPTO.ToString()
                                }).ToList();

                    if (lcon.Count == 0)
                    {
                        var lcon2 = (from co in db.CONCEPTOes.ToList()
                                     join dp in detpep
                                     on new { A = co.ID_CONCEPTO, B = co.TIPO_CONCEPTO } equals new { A = dp.CONCEPTO, B = dp.TIPO_CONCEPTO } //
                                     where co.DESC_CONCEPTO.Contains(Prefix)
                                     select new
                                     {
                                         ID_CONCEPTO = co.ID_CONCEPTO.ToString(),
                                         TIPO_CONCEPTO = co.TIPO_CONCEPTO.ToString(),
                                         DESC_CONCEPTO = co.DESC_CONCEPTO.ToString()
                                     }).ToList();

                        lcon.AddRange(lcon2);
                    }

                    lcont = lcon;
                }


            }

            JsonResult cc = Json(lcont, JsonRequestBehavior.AllowGet);
            return cc;
        }

        [HttpPost]
        public JsonResult getProveedor(string Prefix, string bukrs)
        {

            if (Prefix == null)
                Prefix = "";

            WFARTHAEntities db = new WFARTHAEntities();

            //var c = (from m in db.MAT
            //         where m.ID.Contains(Prefix) && m.ACTIVO == true
            //         select new { m.ID, m.MAKTX }).ToList();
            //if (c.Count == 0)
            //{
            //    var c2 = (from m in db.MATERIALs
            //              where m.MAKTX.Contains(Prefix) && m.ACTIVO == true
            //              select new { m.ID, m.MAKTX }).ToList();
            //    c.AddRange(c2);

            SOCIEDAD c = db.SOCIEDADs.Where(soc => soc.BUKRS == bukrs).Include(s => s.PROVEEDORs).FirstOrDefault();
            //List<PROVEEDOR> lprov = new List<PROVEEDOR>();
            //List<PROVEEDOR> lprov2 = new List<PROVEEDOR>();

            var r = (dynamic)null;

            if (c != null)
            {
                var lprov = (from p in c.PROVEEDORs
                             where p.LIFNR.Contains(Prefix)
                             select new
                             {
                                 LIFNR = p.LIFNR.ToString(),
                                 NAME1 = p.NAME1.ToString()
                             }).ToList();

                if (lprov.Count == 0)
                {
                    var lprov2 = (from p in c.PROVEEDORs
                                  where p.NAME1.Contains(Prefix)
                                  select new
                                  {
                                      LIFNR = p.LIFNR.ToString(),
                                      NAME1 = p.NAME1.ToString()
                                  }).ToList();

                    lprov.AddRange(lprov2);
                }

                r = lprov;
            }

            JsonResult cc = Json(r, JsonRequestBehavior.AllowGet);
            return cc;
        }

        [HttpPost]
        public JsonResult getProveedorD(string lifnr)
        {

            if (lifnr == null)
                lifnr = "";

            WFARTHAEntities db = new WFARTHAEntities();

            var lprov = db.PROVEEDORs.Where(p => p.LIFNR == lifnr).Select(pr => new { LIFNR = pr.LIFNR.ToString(), NAME1 = pr.NAME1.ToString(), STCD1 = pr.STCD1.ToString() }).FirstOrDefault();

            JsonResult cc = Json(lprov, JsonRequestBehavior.AllowGet);
            return cc;
        }

        [HttpPost]//lej 11.09.2018   
        public JsonResult getImpDesc()
        {
            WFARTHAEntities db = new WFARTHAEntities();
            string u = User.Identity.Name;
            var user = db.USUARIOs.Where(a => a.ID.Equals(u)).FirstOrDefault();
            TXTImp txt = new TXTImp();
            List<TXTImp> lsttxt = new List<TXTImp>();
            var impuestot = db.IMPUESTOTs.Where(x => x.SPRAS_ID == user.SPRAS_ID).ToList();
            for (int i = 0; i < impuestot.Count; i++)
            {
                txt = new TXTImp();
                txt.spras_id = impuestot[i].SPRAS_ID;
                txt.imp = impuestot[i].MWSKZ;
                txt.txt = impuestot[i].TXT50;
                lsttxt.Add(txt);
            }
            JsonResult cc = Json(lsttxt, JsonRequestBehavior.AllowGet);
            return cc;
        }

        [HttpPost]
        public JsonResult getRetLigadas(string id)
        {
            var ret = db.RETENCIONs.Where(x => x.WITHT == id).FirstOrDefault().WITHT_SUB;
            if (ret == null)
            {
                ret = "Null";
            }
            JsonResult jc = Json(ret, JsonRequestBehavior.AllowGet);
            return jc;
        }

        [HttpPost]
        [AllowAnonymous]
        public void LoadExcelSop()
        {

            if (Request.Files.Count > 0)
            {
                HttpPostedFileBase file = Request.Files["FileUpload"];
                //using (var stream2 = System.IO.File.Open(url, System.IO.FileMode.Open, System.IO.FileAccess.Read))
                //{
                string extension = System.IO.Path.GetExtension(file.FileName);
                // Auto-detect format, supports:
                //  - Binary Excel files (2.0-2003 format; *.xls)
                //  - OpenXml Excel files (2007 format; *.xlsx)
                //using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(file.InputStream))
                //{
                IExcelDataReader reader = ExcelReaderFactory.CreateReader(file.InputStream);
                // 2. Use the AsDataSet extension method
                DataSet result = reader.AsDataSet();

                // The result of each spreadsheet is in result.Tables
                // 3.DataSet - Create column names from first row
                DataTable dt = result.Tables[0];

                //Rows
                var rowsc = dt.Rows.Count;
                //columns
                var columnsc = dt.Columns.Count;

                //Columnd and row to start
                var rows = 1; // 2
                              //var cols = 0; // A
                int pos = 1;

                for (int i = rows; i < rowsc; i++)
                {

                    CONCEPTO doc = new CONCEPTO();


                    try
                    {
                        doc.ID_CONCEPTO = dt.Rows[i][1].ToString(); //id
                    }
                    catch (Exception e)
                    {
                        doc.ID_CONCEPTO = null;
                    }
                    try
                    {
                        doc.DESC_CONCEPTO = dt.Rows[i][2].ToString(); //desc
                    }
                    catch (Exception e)
                    {
                        doc.DESC_CONCEPTO = null;
                    }

                    try
                    {
                        doc.TIPO_CONCEPTO = dt.Rows[i][3].ToString(); //tipo concepto
                    }
                    catch (Exception e)
                    {
                        doc.TIPO_CONCEPTO = null;
                    }
                    try
                    {

                        doc.TIPO_IMPUTACION = dt.Rows[i][4].ToString(); //tipo imputación
                    }
                    catch (Exception e)
                    {
                        doc.TIPO_IMPUTACION = null;
                    }
                    try
                    {
                        doc.ID_PRESUPUESTO = dt.Rows[i][5].ToString(); //id presupuesto
                    }
                    catch (Exception e)
                    {
                        doc.ID_PRESUPUESTO = null;
                    }
                    try
                    {
                        doc.TIPO_PRESUPUESTO = dt.Rows[i][6].ToString(); //tipo presupuesto
                    }
                    catch (Exception e)
                    {
                        doc.TIPO_PRESUPUESTO = null;
                    }
                    try
                    {
                        doc.CUENTA = dt.Rows[i][7].ToString(); //cuenta
                    }
                    catch (Exception e)
                    {
                        doc.CUENTA = null;
                    }

                    try
                    {

                        db.CONCEPTOes.Add(doc);
                        db.SaveChanges();
                    }
                    catch (Exception e)
                    {
                        string mess = e.Message.ToString();
                    }

                }
            }
        }

        public string SaveFile(HttpPostedFileBase file, string path)
        {
            string ex = "";
            //string exdir = "";
            // Get the name of the file to upload.
            string fileName = file.FileName;//System.IO.Path.GetExtension(file.FileName);    // must be declared in the class above

            // Specify the path to save the uploaded file to.
            string savePath = path + "//";

            // Create the path and file name to check for duplicates.
            string pathToCheck = savePath;

            // Append the name of the file to upload to the path.
            savePath += fileName;
            //-------------------------------------------------------------------
            FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://" + path + "/" + fileName);
            request.Method = WebRequestMethods.Ftp.UploadFile;

            const string Comillas = "\"";
            string pwd = "Rumaki,2571" + Comillas + "k41";
            request.Credentials = new NetworkCredential("luis.gonzalez", pwd);
            var sourceStream = file.InputStream;
            Stream requestStream = request.GetRequestStream();
            request.ContentLength = sourceStream.Length;

            StreamReader streamReader = new StreamReader(file.InputStream);
            byte[] fileContents = System.Text.Encoding.UTF8.GetBytes(streamReader.ReadToEnd());
            sourceStream.Close();
            requestStream.Write(fileContents, 0, fileContents.Length);
            requestStream.Close();
            request.ContentLength = fileContents.Length;

            var response = (FtpWebResponse)request.GetResponse();
            //-------------------------------------------------------------------
            //Parte para guardar archivo en el servidor
            try
            {
                //Guardar el archivo
                // file.SaveAs(savePath);
            }
            catch (Exception e)
            {
                ex = "";
                ex = fileName;
            }

            //Guardarlo en la base de datos
            if (ex == "")
            {

            }
            return savePath;
        }
    }
    public class TXTImp
    {
        public string spras_id { get; set; }
        public string imp { get; set; }
        public string txt { get; set; }
    }

    public class Anexo
    {
        public int a1 { get; set; }
        public int a2 { get; set; }
        public int a3 { get; set; }
        public int a4 { get; set; }
        public int a5 { get; set; }
    }
}
