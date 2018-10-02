using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WFARTHA.Models
{
    public class DOCUMENTOP_MODSTR
    {
        public decimal NUM_DOC { get; set; }
        public decimal POS { get; set; }
        public string ACCION { get; set; }
        public string FACTURA { get; set; }
        public string GRUPO { get; set; }
        public string CUENTA { get; set; }
        public string NOMCUENTA { get; set; }
        public string TIPOIMP { get; set; }
        public string IMPUTACION { get; set; }
        public string MONTO { get; set; }
        public string IVA { get; set; }
        public string TEXTO { get; set; }
        public string TOTAL { get; set; }
    }
}