using ExcelDataReader;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.HtmlControls;
using WFARTHA.Common;
using WFARTHA.Entities;
using WFARTHA.Models;
using WFARTHA.Services;

namespace TAT001.Controllers.Catalogos
{
    [Authorize]
    public class UsuarioCController : Controller
    {

        private WFARTHAEntities db = new WFARTHAEntities();



        // GET: UsuarioC
        public ActionResult Index()
        {
            int pagina = 681; //ID EN BASE DE DATOS
            FnCommon.ObtenerConfPage(db, pagina, User.Identity.Name, this.ControllerContext.Controller);
            var UsuarioC = db.DET_APROBV;
            UsuarioCNuevo un = new UsuarioCNuevo();
            un.L = UsuarioC.ToList();
            return View(un);
        }


        // GET: Usuarios/Create
        public ActionResult Create()
        {
            int pagina = 683; //ID EN BASE DE DATOS
            FnCommon.ObtenerConfPage(db, pagina, User.Identity.Name, this.ControllerContext.Controller);
            UsuarioC obj = new UsuarioC();
            return View(obj);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID_SOCIEDAD,ID_USUARIO")] UsuarioC usuarioC)
        {
            DET_APROB u = new DET_APROB();
            u.ID_SOCIEDAD = usuarioC.ID_SOCIEDAD;
            u.ID_USUARIO = usuarioC.ID_USUARIO;
            u.VERSION = 1;
            u.STEP_FASE = 99;

            db.DET_APROB.Add(u);

            try
            {
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            catch {
                ViewBag.Error = "El usuario ya existe. Introduzca un ID de usuario diferente";
                int pagina = 683; //ID EN BASE DE DATOS
                FnCommon.ObtenerConfPage(db, pagina, User.Identity.Name, this.ControllerContext.Controller);
                UsuarioC obj = new UsuarioC();
                return View(obj);
            }

        }

        public ActionResult Delete(String ID_SOCIEDAD , String ID_USUARIO)
        {
            DET_APROB dET_APROB = db.DET_APROB.Find(1, ID_SOCIEDAD, ID_USUARIO);
            db.DET_APROB.Remove(dET_APROB);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

   

    }
}