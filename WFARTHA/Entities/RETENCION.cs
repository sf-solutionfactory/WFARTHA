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
    
    public partial class RETENCION
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public RETENCION()
        {
            this.DOCUMENTORPs = new HashSet<DOCUMENTORP>();
            this.RETENCION_PROV = new HashSet<RETENCION_PROV>();
            this.RETENCIONTs = new HashSet<RETENCIONT>();
        }
    
        public string WITHT { get; set; }
        public string WT_WITHCD { get; set; }
        public string DESCRIPCION { get; set; }
        public bool ESTATUS { get; set; }
        public string WITHT_SUB { get; set; }
        public Nullable<decimal> PORC { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DOCUMENTORP> DOCUMENTORPs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<RETENCION_PROV> RETENCION_PROV { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<RETENCIONT> RETENCIONTs { get; set; }
    }
}
