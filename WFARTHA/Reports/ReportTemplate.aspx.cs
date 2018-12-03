using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WFARTHA.Reports
{
    public partial class ReportTemplate : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            if (!IsPostBack)
            {
                try
                {
                    //String reportFolder = System.Configuration.ConfigurationManager.AppSettings["SSRSReportsFolder"].ToString();

                    //rvSiteMapping.Height = Unit.Pixel(Convert.ToInt32(Request["Height"]) - 58);
                    //rvSiteMapping.ProcessingMode = Microsoft.Reporting.WebForms.ProcessingMode.Remote;

                    //rvSiteMapping.ServerReport.ReportServerUrl = new Uri("SSRS URL"); // Add the Reporting Server URL  
                    //rvSiteMapping.ServerReport.ReportPath = String.Format("/{0}/{1}", reportFolder, Request["ReportName"].ToString());

                    //rvSiteMapping.ServerReport.Refresh();

                    //Obtener los parámetros
                    int Height = Convert.ToInt32(Request["Height"]);
                    string ReportServer = Request["ReportServer"].ToString();
                    string ReportFolder = Request["ReportFolder"].ToString();
                    string ReportName = Request["ReportName"].ToString();

                    //Enviar parámetro a server
                    string fac = Request["ReportId"].ToString();
                    ReportParameter fp = new ReportParameter("NUM_DOC", fac);


                    rvSiteMapping.Height = Unit.Pixel(Height - 58);

                    rvSiteMapping.ProcessingMode = ProcessingMode.Remote;
                    
                    rvSiteMapping.ServerReport.ReportServerUrl = new Uri(ReportServer); // Add the Reporting Server URL  
                    rvSiteMapping.ServerReport.ReportPath = "/" + ReportFolder + "/" + ReportName;
                    rvSiteMapping.ServerReport.SetParameters(fp);
                    rvSiteMapping.ServerReport.Refresh();

                }
                catch (Exception ex)
                {

                }
            }

        }
    }
}