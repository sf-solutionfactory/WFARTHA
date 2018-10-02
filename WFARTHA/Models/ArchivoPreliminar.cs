using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using WFARTHA.Entities;
using WFARTHA.Services;

namespace WFARTHA.Models
{
    public class ArchivoPreliminar
    {
        WFARTHAEntities db = new WFARTHAEntities();
        public string generarArchivo(decimal docum)
        {

            string errorMessage = "";

            try
            {
                string dirFile = "";
                DOCUMENTO doc = db.DOCUMENTOes.Where(x => x.NUM_DOC == docum).Single();
                TSOL ts = db.TSOLs.Where(tsi => tsi.ID == doc.TSOL_ID).FirstOrDefault();

                string txt = "";
                string msj = "";
                string[] cc;
                string cta = "";


                dirFile = ConfigurationManager.AppSettings["URL_PREL"].ToString() + @"POSTING";
                string docname = dirFile + @"\INBOUND_PREL" + ts.ID.Substring(0, 2) + docum.ToString().PadLeft(10, '0') + "-1.txt";

                doc.FECHAC = Fecha("D", Convert.ToDateTime(doc.FECHAC));

                List<DetalleContab> det = new List<DetalleContab>();

                var dir = new Files().createDir(dirFile);//RSG 01.08.2018

                //Evaluar que se creo el directorio
                if (dir.Equals(""))
                {
                    using (StreamWriter sw = new StreamWriter(docname))
                    {

                        //Formato a fecha mes, día, año
                        sw.WriteLine(
                            doc.DOCUMENTO_SAP + "|" +
                            doc.SOCIEDAD_ID.Trim() + "|"
                            + String.Format("{0:MM.dd.yyyy}", doc.FECHAC).Replace(".", "") + "|"
                            + doc.MONEDA_ID.Trim() + "|"

                            + "|" +
                            doc.REFERENCIA + "|"
                            + "X" + "|"
                            + "|"
                            + ""
                            );
                        sw.WriteLine("");
                        //for (int i = 0; i < det.Count; i++)
                        for (int i = 0; i < doc.DOCUMENTOPs.Count; i++)
                        {
                            string post = "";
                            string postk = "";

                            if (doc.DOCUMENTOPs.ElementAt(i).ACCION == "H")
                            {
                                post = "P";
                                postk = "31";
                            }
                            else if (doc.DOCUMENTOPs.ElementAt(i).ACCION == "D")
                            {
                                post = "G";
                                postk = "40";

                            }
                            sw.WriteLine(
                                //det[i].POS_TYPE + "|" +
                                post + "|" +
                                doc.SOCIEDAD_ID.Trim() + "|" + //det[i].COMP_CODE + "|" + //
                                                               //det[i].BUS_AREA + "|" +
                                "|" +
                                //det[i].POST_KEY + "|" +
                                postk + "|" +
                                doc.DOCUMENTOPs.ElementAt(i).CUENTA + "|" +//det[i].ACCOUNT + "|" +
                                doc.DOCUMENTOPs.ElementAt(i).CCOSTO + "|" +//det[i].COST_CENTER + "|" +
                                doc.DOCUMENTOPs.ElementAt(i).IMPUTACION + "|" +
                                doc.DOCUMENTOPs.ElementAt(i).MONTO + "|" +//det[i].BALANCE + "|" +
                                "TEXTO PRUEBA " + i + "|" + //det[i].TEXT + "|" +
                                                            //det[i].SALES_ORG + "|" +
                                                            //det[i].DIST_CHANEL + "|" +
                                "|" +
                                "|" +
                                //det[i].DIVISION + "|" +
                                "|" +
                                //"|" +
                                //"|" +
                                //"|" +
                                //"|" +
                                //"|" +
                                //det[i].INV_REF + "|" +
                                //det[i].PAY_TERM + "|" +
                                //det[i].JURIS_CODE + "|" +
                                "|" +
                                "|" +
                                "|" +
                                //"|" +
                                //det[i].CUSTOMER + "|" +
                                //det[i].PRODUCT + "|" +
                                "|" +
                                "|" +
                                doc.DOCUMENTOPs.ElementAt(i).MWSKZ + "|" +//det[i].TAX_CODE + "|" +
                                                                          //det[i].PLANT + "|" +
                                                                          //det[i].REF_KEY1 + "|" +
                                                                          //det[i].REF_KEY3 + "|" +
                                                                          //det[i].ASSIGNMENT + "|" +
                                                                          //det[i].QTY + "|" +
                                                                          //det[i].BASE_UNIT + "|" +
                                                                          //det[i].AMOUNT_LC + "|" +
                                                                          //det[i].RETENCION_ID + "|"
                                "|" +
                                "|" +
                                "|" +
                                "|" +
                                "|" +
                                "|" +
                                "|" +
                                "|"
                                );
                        }
                        sw.Close();
                    }

                }
                else
                {
                    errorMessage = dir;
                }

                //if (tab.RELACION != 0 && tab.RELACION != null)
                //{
                //    return generarArchivo(docum, Convert.ToInt32(tab.RELACION));
                //}
                //else
                //{
                //return "";
                //}
            }
            catch (Exception e)
            {
                //return "Error al generar el documento contable " + e.Message;
                errorMessage = "Error al generar el archivo txt preliminar " + e.Message;
            }

            return errorMessage;
        }

        private DateTime Fecha(string id_fecha, DateTime fech)
        {
            DateTime fecha = DateTime.Today;
            switch (id_fecha)
            {
                case "U":
                    fecha = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
                    fecha = fecha.AddMonths(1).AddDays(-1);
                    break;
                case "P":
                    fecha = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
                    break;
                case "H":
                    fecha = DateTime.Today;
                    break;
                default:
                    fecha = fech;
                    break;
            }
            return fecha;
        }
    }
}