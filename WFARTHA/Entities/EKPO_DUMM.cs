//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WFARTHA.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class EKPO_DUMM
    {
        public string EBELN { get; set; }
        public decimal EBELP { get; set; }
        public string TXZ0 { get; set; }
        public string MATNR { get; set; }
        public Nullable<decimal> MENGE { get; set; }
        public string MEINS { get; set; }
        public Nullable<decimal> BPUMZ { get; set; }
        public Nullable<decimal> BPUMN { get; set; }
        public Nullable<decimal> NETWR { get; set; }
        public Nullable<decimal> BRTWR { get; set; }
        public Nullable<decimal> H_QUANTITY { get; set; }
        public Nullable<decimal> H_VAL_LOCCUR { get; set; }
        public Nullable<decimal> H_VAL_FORCUR { get; set; }
        public string H_VAL_CURRENCY { get; set; }
        public Nullable<decimal> H_ANT_PAG { get; set; }
        public Nullable<decimal> H_ANT_SOL { get; set; }
        public Nullable<decimal> H_ANT_AMORT { get; set; }
    
        public virtual EKKO_DUMM EKKO_DUMM { get; set; }
    }
}
