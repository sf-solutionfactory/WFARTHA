//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WFARTHA.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class DOCUMENTORP
    {
        public decimal NUM_DOC { get; set; }
        public decimal POS { get; set; }
        public string WITHT { get; set; }
        public string WT_WITHCD { get; set; }
        public Nullable<decimal> BIMPONIBLE { get; set; }
        public Nullable<decimal> IMPORTE_RET { get; set; }
    
        public virtual DOCUMENTOP DOCUMENTOP { get; set; }
        public virtual RETENCION RETENCION { get; set; }
    }
}
