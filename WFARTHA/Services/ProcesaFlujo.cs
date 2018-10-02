using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WFARTHA.Entities;
using WFARTHA.Models;

namespace TAT001.Services
{
    public class ProcesaFlujo
    {
        public string procesa(decimal id)
        {
            string correcto = String.Empty;
            WFARTHAEntities db = new WFARTHAEntities();


            DOCUMENTO d = db.DOCUMENTOes.Find(id);
            bool ban = true;
            ArchivoContable sa = new ArchivoContable();
            string file = sa.generarArchivo(d.NUM_DOC, 0);

            if (file == "")
            {
                correcto = "0";
            }
            else
            {
                ban = false;
                correcto = file;
            }

            return correcto;
        }

        //public FLUJO determinaAgente(DOCUMENTO d, string user, string delega, int pos, int? loop, int sop)
        //{
        //    if (delega != null)
        //        user = delega;
        //    bool fin = false;
        //    TAT001Entities db = new TAT001Entities();
        //    DET_AGENTEC dap = new DET_AGENTEC();
        //    FLUJO f_actual = db.FLUJOes.Where(a => a.NUM_DOC.Equals(d.NUM_DOC)).FirstOrDefault();
        //    //DET_AGENTEH dah = db.DET_AGENTEH.Where(a => a.SOCIEDAD_ID.Equals(d.SOCIEDAD_ID) & a.PUESTOC_ID == d.PUESTO_ID &
        //    //                    a.USUARIOC_ID.Equals(d.USUARIOC_ID) & a.VERSION == f_actual.DETVER).FirstOrDefault();
        //    List<DET_AGENTEC> dah = db.DET_AGENTEC.Where(a => a.USUARIOC_ID.Equals(d.USUARIOD_ID) & a.PAIS_ID == d.PAIS_ID &
        //                        a.VKORG.Equals(d.VKORG) & a.VTWEG.Equals(d.VTWEG) & a.SPART.Equals(d.SPART) & a.KUNNR.Equals(d.PAYER_ID))
        //                        .OrderByDescending(a => a.VERSION).ToList();

        //    USUARIO u = db.USUARIOs.Find(d.USUARIOC_ID);
        //    //long gaa = db.CREADOR2.Where(a => a.ID.Equals(u.ID) & a.BUKRS.Equals(d.SOCIEDAD_ID) & a.LAND.Equals(d.PAIS_ID) & a.PUESTOC_ID == d.PUESTO_ID & a.ACTIVO == true).FirstOrDefault().AGROUP_ID;
        //    int ppos = 0;

        //    if (pos.Equals(0))
        //    {
        //        if (loop == null)
        //        {
        //            //dap = db.DET_AGENTEP.Where(a => a.SOCIEDAD_ID.Equals(dah.SOCIEDAD_ID) & a.PUESTOC_ID == dah.PUESTOC_ID &
        //            //                    a.VERSION == dah.VERSION & a.AGROUP_ID == dah.AGROUP_ID & a.POS == 1).FirstOrDefault();
        //            dap = dah.Where(a => a.POS == 1).FirstOrDefault();
        //            dap.POS = dap.POS - 1;
        //        }
        //        else
        //        {
        //            FLUJO ffl = db.FLUJOes.Where(a => a.NUM_DOC.Equals(d.NUM_DOC) & a.ESTATUS.Equals("R")).OrderByDescending(a => a.POS).FirstOrDefault();
        //            if (ffl.DETPOS == 99)
        //                ppos = 1;
        //            ffl.DETPOS = ffl.DETPOS - 1;
        //            fin = true;
        //            ffl.POS = ppos;

        //            return ffl;
        //        }
        //    }
        //    else if (pos.Equals(98))
        //    {
        //        dap = dah.Where(a => a.POS == (pos + 1)).FirstOrDefault();
        //    }
        //    else
        //    {
        //        //DET_AGENTE actual = db.DET_AGENTE.Where(a => a.PUESTOC_ID == d.PUESTO_ID & a.AGROUP_ID == gaa & a.POS == (pos)).FirstOrDefault();
        //        DET_AGENTEC actual = dah.Where(a => a.POS == (pos)).FirstOrDefault();
        //        if (actual.POS == 99)
        //        {
        //            fin = true;
        //        }
        //        else if (actual.POS == 98)
        //        {
        //            //da = db.DET_AGENTE.Where(a => a.PUESTOC_ID == d.PUESTO_ID & a.AGROUP_ID == gaa & a.POS == (pos + 1)).FirstOrDefault();
        //            dap = dah.Where(a => a.POS == (pos)).FirstOrDefault();
        //        }
        //        else
        //        {
        //            if (actual.MONTO != null)
        //                if (d.MONTO_DOC_ML2 > actual.MONTO)
        //                {
        //                    dap = dah.Where(a => a.POS == (pos + 1)).FirstOrDefault();
        //                    ppos = -1;
        //                }
        //            //if (actual.PRESUPUESTO != null)
        //            if ((bool)actual.PRESUPUESTO)
        //                if (d.MONTO_DOC_MD > 100000)
        //                {
        //                    //da = db.DET_AGENTE.Where(a => a.PUESTOC_ID == d.PUESTO_ID & a.AGROUP_ID == gaa & a.POS == (pos + 1)).FirstOrDefault();
        //                    dap = dah.Where(a => a.POS == (pos + 1)).FirstOrDefault();
        //                    ppos = -1;
        //                }
        //        }
        //    }

        //    string agente = "";
        //    FLUJO f = new FLUJO();
        //    f.DETPOS = 0;
        //    if (!fin)
        //    {
        //        if (dap != null)
        //        {
        //            if (dap.USUARIOA_ID != null)
        //            {
        //                //agente = db.GAUTORIZACIONs.Where(a => a.ID == da.AGROUP_ID).FirstOrDefault().USUARIOs.Where(a => a.PUESTO_ID == da.PUESTOA_ID).First().ID;
        //                agente = dap.USUARIOA_ID;
        //                f.DETPOS = dap.POS;
        //            }
        //            else
        //            {
        //                dap = dah.Where(a => a.POS == (sop)).FirstOrDefault();
        //                if (dap == null)
        //                {
        //                    agente = d.USUARIOD_ID;
        //                    f.DETPOS = 98;
        //                }
        //                else
        //                {
        //                    //agente = db.GAUTORIZACIONs.Where(a => a.ID == da.AGROUP_ID).FirstOrDefault().USUARIOs.Where(a => a.PUESTO_ID == da.PUESTOA_ID).First().ID;
        //                    agente = dap.USUARIOA_ID;
        //                    f.DETPOS = dap.POS;
        //                }
        //            }
        //        }
        //        else
        //        {
        //            dap = dah.Where(a => a.POS == (sop)).FirstOrDefault();
        //            if (dap == null)
        //            {
        //                agente = d.USUARIOD_ID;
        //                f.DETPOS = 98;
        //            }
        //            else
        //            {
        //                //agente = db.GAUTORIZACIONs.Where(a => a.ID == da.AGROUP_ID).FirstOrDefault().USUARIOs.Where(a => a.PUESTO_ID == da.PUESTOA_ID).First().ID;
        //                agente = dap.USUARIOA_ID;
        //                f.DETPOS = dap.POS;
        //            }
        //        }
        //    }
        //    f.POS = ppos;
        //    if (agente != "")
        //        f.USUARIOA_ID = agente;
        //    else
        //        f.USUARIOA_ID = null;
        //    return f;
        //}

        //public FLUJO determinaAgenteI(DOCUMENTO d, string user, string delega, int pos, DET_AGENTEC dah)
        //{
        //    if (delega != null)
        //        user = delega;
        //    bool fin = false;
        //    TAT001Entities db = new TAT001Entities();
        //    DET_AGENTEC dap = new DET_AGENTEC();
        //    USUARIO u = db.USUARIOs.Find(d.USUARIOC_ID);

        //    if (pos.Equals(0))
        //    {
        //        //dap = db.DET_AGENTEP.Where(a => a.SOCIEDAD_ID.Equals(dah.SOCIEDAD_ID) & a.PUESTOC_ID == dah.PUESTOC_ID &
        //        //                    a.VERSION == dah.VERSION & a.AGROUP_ID == dah.AGROUP_ID & a.POS == 1).FirstOrDefault();
        //        dap = db.DET_AGENTEC.Where(a => a.USUARIOC_ID.Equals(delega) & a.PAIS_ID == dah.PAIS_ID &
        //                           a.VKORG.Equals(dah.VKORG) & a.VTWEG.Equals(dah.VTWEG) & a.SPART.Equals(dah.SPART) & a.KUNNR.Equals(dah.KUNNR) &
        //                           a.VERSION == dah.VERSION & a.POS == 1).FirstOrDefault();


        //    }

        //    string agente = "";
        //    FLUJO f = new FLUJO();
        //    f.DETPOS = 0;
        //    if (!fin)
        //    {
        //        agente = dap.USUARIOA_ID;
        //        f.DETPOS = dap.POS;
        //    }
        //    f.USUARIOA_ID = agente;
        //    return f;
        //}

    }
}