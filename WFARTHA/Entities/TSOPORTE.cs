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
    
    public partial class TSOPORTE
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public TSOPORTE()
        {
            this.DOCUMENTOAs = new HashSet<DOCUMENTOA>();
            this.TSOPORTETs = new HashSet<TSOPORTET>();
        }
    
        public string ID { get; set; }
        public string DESCRIPCION { get; set; }
        public Nullable<bool> ACTIVO { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DOCUMENTOA> DOCUMENTOAs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TSOPORTET> TSOPORTETs { get; set; }
    }
}
