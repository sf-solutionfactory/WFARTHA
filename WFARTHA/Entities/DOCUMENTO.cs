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
    
    public partial class DOCUMENTO
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public DOCUMENTO()
        {
            this.DOCUMENTOPs = new HashSet<DOCUMENTOP>();
            this.DOCUMENTOPREs = new HashSet<DOCUMENTOPRE>();
            this.DOCUMENTORs = new HashSet<DOCUMENTOR>();
            this.FLUJOes = new HashSet<FLUJO>();
        }
    
        public decimal NUM_DOC { get; set; }
        public decimal NUM_PRE { get; set; }
        public string TSOL_ID { get; set; }
        public string TALL_ID { get; set; }
        public string SOCIEDAD_ID { get; set; }
        public Nullable<decimal> CANTIDAD_EV { get; set; }
        public string USUARIOC_ID { get; set; }
        public string USUARIOD_ID { get; set; }
        public Nullable<System.DateTime> FECHAD { get; set; }
        public Nullable<System.DateTime> FECHAC { get; set; }
        public Nullable<System.TimeSpan> HORAC { get; set; }
        public Nullable<System.DateTime> FECHAC_PLAN { get; set; }
        public Nullable<System.DateTime> FECHAC_USER { get; set; }
        public Nullable<System.TimeSpan> HORAC_USER { get; set; }
        public string ESTATUS { get; set; }
        public string ESTATUS_C { get; set; }
        public string ESTATUS_SAP { get; set; }
        public string ESTATUS_WF { get; set; }
        public Nullable<decimal> DOCUMENTO_REF { get; set; }
        public string CONCEPTO { get; set; }
        public string NOTAS { get; set; }
        public Nullable<decimal> MONTO_DOC_MD { get; set; }
        public Nullable<decimal> MONTO_FIJO_MD { get; set; }
        public Nullable<decimal> MONTO_BASE_GS_PCT_MD { get; set; }
        public Nullable<decimal> MONTO_BASE_NS_PCT_MD { get; set; }
        public Nullable<decimal> MONTO_DOC_ML { get; set; }
        public Nullable<decimal> MONTO_FIJO_ML { get; set; }
        public Nullable<decimal> MONTO_BASE_GS_PCT_ML { get; set; }
        public Nullable<decimal> MONTO_BASE_NS_PCT_ML { get; set; }
        public Nullable<decimal> MONTO_DOC_ML2 { get; set; }
        public Nullable<decimal> MONTO_FIJO_ML2 { get; set; }
        public Nullable<decimal> MONTO_BASE_GS_PCT_ML2 { get; set; }
        public Nullable<decimal> MONTO_BASE_NS_PCT_ML2 { get; set; }
        public Nullable<decimal> PORC_ADICIONAL { get; set; }
        public string IMPUESTO { get; set; }
        public string ESTATUS_EXT { get; set; }
        public string PAYER_ID { get; set; }
        public string MONEDA_ID { get; set; }
        public string MONEDAL_ID { get; set; }
        public string MONEDAL2_ID { get; set; }
        public Nullable<decimal> TIPO_CAMBIO { get; set; }
        public Nullable<decimal> TIPO_CAMBIOL { get; set; }
        public Nullable<decimal> TIPO_CAMBIOL2 { get; set; }
        public string NO_FACTURA { get; set; }
        public Nullable<System.DateTime> FECHAD_SOPORTE { get; set; }
        public string METODO_PAGO { get; set; }
        public string NO_PROVEEDOR { get; set; }
        public Nullable<int> PASO_ACTUAL { get; set; }
        public string AGENTE_ACTUAL { get; set; }
        public Nullable<System.DateTime> FECHA_PASO_ACTUAL { get; set; }
        public Nullable<int> PUESTO_ID { get; set; }
        public string GALL_ID { get; set; }
        public Nullable<int> CONCEPTO_ID { get; set; }
        public string DOCUMENTO_SAP { get; set; }
        public Nullable<System.DateTime> FECHACON { get; set; }
        public Nullable<System.DateTime> FECHA_BASE { get; set; }
        public string REFERENCIA { get; set; }
        public string CONDICIONES { get; set; }
        public string TEXTO_POS { get; set; }
        public string ASIGNACION_POS { get; set; }
        public string CLAVE_CTA { get; set; }
        public string SOCIEDAD_PRE { get; set; }
        public string EJERCICIO_PRE { get; set; }
    
        public virtual SOCIEDAD SOCIEDAD { get; set; }
        public virtual TSOL TSOL { get; set; }
        public virtual USUARIO USUARIO { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DOCUMENTOP> DOCUMENTOPs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DOCUMENTOPRE> DOCUMENTOPREs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DOCUMENTOR> DOCUMENTORs { get; set; }
        public virtual DOCUMENTOSAP DOCUMENTOSAP { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FLUJO> FLUJOes { get; set; }
    }
}
