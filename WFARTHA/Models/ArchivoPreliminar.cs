﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using WFARTHA.Entities;
using WFARTHA.Services;

namespace WFARTHA.Models
{
    public class ArchivoPreliminar
    {
        WFARTHAEntities db = new WFARTHAEntities();
        public string generarArchivo(decimal docum, string accion)
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

                //Obtener la configuración de la url desde app setting
                string url_prel = "";
                try
                {
                    url_prel = db.APPSETTINGs.Where(aps => aps.NOMBRE.Equals("URL_PREL") && aps.ACTIVO == true).FirstOrDefault().VALUE.ToString();
                    url_prel += @"POSTING";
                    dirFile = url_prel;
                }
                catch(Exception e)
                {
                    dirFile = ConfigurationManager.AppSettings["URL_PREL"].ToString() + @"POSTING";
                }

                //dirFile = ConfigurationManager.AppSettings["URL_PREL"].ToString() + @"POSTING";
                string docname = dirFile + @"\INBOUND_PREL" + ts.ID.Substring(0, 2) + docum.ToString().PadLeft(10, '0') + "-1.txt";

                //MGC 11-10-2018 Acciones para el encabezado -->

                string variable = "";
                string accionhead = "";
                //Preliminar
                if(accion == "P")
                {
                    variable = "ACCION_CREAR";
                }else if(accion == "R")
                {
                    variable = "ACCION_BC";
                }
                else if (accion == "A")
                {
                    variable = "ACCION_CONTABILIZAR";
                }

                //Obtener el nombre de la acción desde la bd en APPSETTING
                try
                {
                    accionhead = db.APPSETTINGs.Where(aps => aps.NOMBRE.Equals(variable) && aps.ACTIVO == true).FirstOrDefault().VALUE.ToString();
                        
                }catch(Exception e)
                {

                }

                //MGC 11-10-2018 Acciones para el encabezado <--


                doc.FECHAC = Fecha("D", Convert.ToDateTime(doc.FECHAC));

                List<DetalleContab> det = new List<DetalleContab>();

                var dir = new Files().createDir(dirFile);//RSG 01.08.2018

                ////Evaluar que se creo el directorio
                //if (dir.Equals(""))
                //{
                //    using (StreamWriter sw = new StreamWriter(docname))
                //    {
                //        string belnr = "";
                //        string bjahr = "";
                //        string bukrs = "";

                //        if (accion == "R")
                //        {
                //            belnr = doc.NUM_PRE + "";
                //            bjahr = doc.EJERCICIO_PRE + "";
                //            bukrs = doc.SOCIEDAD_PRE + "";
                //        }

                //        //DETDOC	|TIPODOC|ACCION|BELNR|GJAHR|BUKRS DETDOC EJE	FACSINOC|CONTABILIZAR|10000000|2018|1010| //MGC 11-10-2018 Acciones para el encabezado -->
                //        sw.WriteLine(
                //            "1"+ "|" +
                //            ts.TIPO_DOCFILE.Trim() + "|" +
                //            doc.NUM_DOC+"|" +
                //            accionhead.Trim() + "|"+
                //            belnr + "|"+
                //            bjahr + "|"+
                //            bukrs + "|"
                //            );
                //        sw.WriteLine("");

                //        //DETDOC	|TIPODOC|ACCION|BELNR|GJAHR|BUKRS DETDOC EJE	FACSINOC|CONTABILIZAR|10000000|2018|1010| //MGC 11-10-2018 Acciones para el encabezado <--

                //        //Formato a fecha mes, día, año
                //        sw.WriteLine(
                //            "2" + "|" +
                //            doc.DOCUMENTO_SAP + "|" +
                //            doc.SOCIEDAD_ID.Trim() + "|" +
                //            String.Format("{0:MM.dd.yyyy}", doc.FECHAC).Replace(".", "") + "|"+
                //            doc.MONEDA_ID.Trim() + "|" +
                //            //+ "|" + //MGC 11-10-2018 Acciones para el encabezado
                //            doc.REFERENCIA + "|"+
                //            doc.CONCEPTO + "|" + //MGC 11-10-2018 Acciones para el encabezado
                //            "X" + "|"+
                //            doc.TIPO_CAMBIO + "|" //MGC 11-10-2018 Acciones para el encabezado
                //            + ""
                //            );
                //        sw.WriteLine("");
                //        //for (int i = 0; i < det.Count; i++)
                //        for (int i = 0; i < doc.DOCUMENTOPs.Count; i++)
                //        {
                //            string post = "";
                //            string postk = "";

                //            if (doc.DOCUMENTOPs.ElementAt(i).ACCION == "H")
                //            {
                //                post = "P";
                //                postk = "31";
                //            }
                //            else if (doc.DOCUMENTOPs.ElementAt(i).ACCION == "D")
                //            {
                //                post = "G";
                //                postk = "40";

                //            }
                //            sw.WriteLine(
                //                //det[i].POS_TYPE + "|" +
                //                "3" + "|" +
                //                post + "|" +
                //                doc.SOCIEDAD_ID.Trim() + "|" + //det[i].COMP_CODE + "|" + //
                //                                               //det[i].BUS_AREA + "|" +
                //                "|" +
                //                //det[i].POST_KEY + "|" +
                //                postk + "|" +
                //                doc.DOCUMENTOPs.ElementAt(i).CUENTA + "|" +//det[i].ACCOUNT + "|" +
                //                doc.DOCUMENTOPs.ElementAt(i).CCOSTO + "|" +//det[i].COST_CENTER + "|" +
                //                doc.DOCUMENTOPs.ElementAt(i).IMPUTACION + "|" +
                //                doc.DOCUMENTOPs.ElementAt(i).MONTO + "|" +//det[i].BALANCE + "|" +
                //                doc.DOCUMENTOPs.ElementAt(i).TEXTO + "|" + //det[i].TEXT + "|" +
                //                                            //det[i].SALES_ORG + "|" +
                //                                            //det[i].DIST_CHANEL + "|" +
                //                "|" +
                //                "|" +
                //                //det[i].DIVISION + "|" +
                //                "|" +
                //                //"|" +
                //                //"|" +
                //                //"|" +
                //                //"|" +
                //                //"|" +
                //                //det[i].INV_REF + "|" +
                //                //det[i].PAY_TERM + "|" +
                //                //det[i].JURIS_CODE + "|" +
                //                "|" +
                //                "|" +
                //                "|" +
                //                //"|" +
                //                //det[i].CUSTOMER + "|" +
                //                //det[i].PRODUCT + "|" +
                //                "|" +
                //                "|" +
                //                doc.DOCUMENTOPs.ElementAt(i).MWSKZ + "|" +//det[i].TAX_CODE + "|" +
                //                                                          //det[i].PLANT + "|" +
                //                                                          //det[i].REF_KEY1 + "|" +
                //                                                          //det[i].REF_KEY3 + "|" +
                //                                                          //det[i].ASSIGNMENT + "|" +
                //                                                          //det[i].QTY + "|" +
                //                                                          //det[i].BASE_UNIT + "|" +
                //                                                          //det[i].AMOUNT_LC + "|" +
                //                                                          //det[i].RETENCION_ID + "|"
                //                "|" +
                //                "|" +
                //                "|" +
                //                "|" +
                //                "|" +
                //                "|" +
                //                "|" +
                //                "|"
                //                );
                //        }
                //        //MGC 11-10-2018 Acciones para el encabezado RETENCIONES -->
                //        for (int i = 0; i < doc.DOCUMENTORs.Count; i++)
                //        {
                //            sw.WriteLine(
                //            "4" + "|" +
                //            "W" + "|" +
                //            doc.DOCUMENTORs.ElementAt(i).WITHT + "|" +
                //            doc.DOCUMENTORs.ElementAt(i).WT_WITHCD + "|" +
                //            doc.DOCUMENTORs.ElementAt(i).BIMPONIBLE + "|" +
                //            doc.DOCUMENTORs.ElementAt(i).IMPORTE_RET + "|" +
                //            ""
                //            );
                //        }
                //        //MGC 11-10-2018 Acciones para el encabezado RETENCIONES <--

                //        sw.Close();
                //    }

                //}
                //else
                //{
                //    errorMessage = dir;
                //}

                //MGC prueba FTP---------------------------------------------------------------------------------------------------------------------------------------->
                
                //Obtener la configuración de la url desde app setting
                string ftpServerIP = "";
                try
                {
                    ftpServerIP = db.APPSETTINGs.Where(aps => aps.NOMBRE.Equals("URL_FTP_PRELIMINAR") && aps.ACTIVO == true).FirstOrDefault().VALUE.ToString();
                    url_prel += @"POSTING";
                    dirFile = url_prel;
                }
                catch (Exception e)
                {
                    
                }
                string targetFileName = "/SAP/POSTING/INBOUND_PREL" + ts.ID.Substring(0, 2) + docum.ToString().PadLeft(10, '0') + "-1.txt";

                //string ftpServerIP = "192.168.32.207:21";
                //string targetFileName = "/SAP/POSTING/prueba.txt";
                string username = "matias.gallegos";
                string password = "Mimapo-2179=p23";

                Uri uri = new Uri(String.Format("ftp://{0}/{1}", ftpServerIP, targetFileName));
                FtpWebRequest reqFTP = (FtpWebRequest)FtpWebRequest.Create(uri);
                reqFTP.Credentials = new NetworkCredential(username, password);
                reqFTP.Method = WebRequestMethods.Ftp.UploadFile;
                reqFTP.KeepAlive = false;
                reqFTP.UsePassive = false;


                MemoryStream stIn = new MemoryStream();
                using (StreamWriter sw = new StreamWriter(stIn))
                {
                    string belnr = "";
                    string bjahr = "";
                    string bukrs = "";

                    if (accion == "R")
                    {
                        belnr = doc.NUM_PRE + "";
                        bjahr = doc.EJERCICIO_PRE + "";
                        bukrs = doc.SOCIEDAD_PRE + "";
                    }

                    //DETDOC	|TIPODOC|ACCION|BELNR|GJAHR|BUKRS DETDOC EJE	FACSINOC|CONTABILIZAR|10000000|2018|1010| //MGC 11-10-2018 Acciones para el encabezado -->
                    sw.WriteLine(
                        "1" + "|" +
                        ts.TIPO_DOCFILE.Trim() + "|" +
                        doc.NUM_DOC + "|" +
                        accionhead.Trim() + "|" +
                        belnr + "|" +
                        bjahr + "|" +
                        bukrs + "|"
                        );
                    //sw.WriteLine(""); //MGC 17-10-2018.2 Adaptación a archivo

                    //DETDOC	|TIPODOC|ACCION|BELNR|GJAHR|BUKRS DETDOC EJE	FACSINOC|CONTABILIZAR|10000000|2018|1010| //MGC 11-10-2018 Acciones para el encabezado <--

                    //Formato a fecha mes, día, año
                    sw.WriteLine(
                        "2" + "|" +
                        doc.DOCUMENTO_SAP + "|" +
                        doc.SOCIEDAD_ID.Trim() + "|" +
                        String.Format("{0:MM.dd.yyyy}", doc.FECHAC).Replace(".", "") + "|" +
                        doc.MONEDA_ID.Trim() + "|" +
                        //+ "|" + //MGC 11-10-2018 Acciones para el encabezado
                        doc.REFERENCIA + "|" +
                        doc.CONCEPTO + "|" + //MGC 11-10-2018 Acciones para el encabezado
                        "" + "|" +
                        "" + "|" +
                        doc.TIPO_CAMBIO  //MGC 11-10-2018 Acciones para el encabezado
                        );
                    //sw.WriteLine("");//MGC 17-10-2018.2 Adaptación a archivo
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
                            "3" + "|" +
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
                            doc.DOCUMENTOPs.ElementAt(i).TEXTO + "|" + //det[i].TEXT + "|" +
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
                    //MGC 11-10-2018 Acciones para el encabezado RETENCIONES -->
                    for (int i = 0; i < doc.DOCUMENTORs.Count; i++)
                    {
                        sw.WriteLine(
                        "4" + "|" +
                        "W" + "|" +
                        doc.DOCUMENTORs.ElementAt(i).WITHT + "|" +
                        doc.DOCUMENTORs.ElementAt(i).WT_WITHCD + "|" +
                        doc.DOCUMENTORs.ElementAt(i).BIMPONIBLE + "|" +
                        doc.DOCUMENTORs.ElementAt(i).IMPORTE_RET //+ "|" //MGC 17-10-2018.2 Adaptación a archivo

                        );
                    }
                    //MGC 11-10-2018 Acciones para el encabezado RETENCIONES <--

                    //sw.Close();
                    sw.Flush();

                    using (Stream stOut = reqFTP.GetRequestStream())
                    {
                        stOut.Write(stIn.GetBuffer(), 0, (int)stIn.Length);
                    }

                    

                }

                FtpWebResponse response = (FtpWebResponse)reqFTP.GetResponse();
                response.Close();
                //MGC prueba FTP----------------------------------------------------------------------------------------------------------------------------------------<

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