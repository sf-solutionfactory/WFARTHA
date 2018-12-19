using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WFARTHA.Models
{
    public class REPORT_MOD
    {
        public string Tsol { get; set; }
        public List<string> Bukrs { get; set; }
        public List<string> Fecha { get; set; }
        public List<string> Payer { get; set; }
        public List<string> Num_pre { get; set; }
        public List<string> User { get; set; }
        public List<decimal> Num_doc { get; set; }
        public List<decimal> Monto { get; set; }
        public string Moneda { get; set; }
        public string Estatus { get; set; }
        public string Pagado { get; set; }
    }
}