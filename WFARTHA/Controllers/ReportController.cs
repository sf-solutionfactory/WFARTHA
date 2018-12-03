using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WFARTHA.Models;

namespace WFARTHA.Controllers
{
    public class ReportController : Controller
    {
        // GET: Report
        public ActionResult Reporte()
        {
            return View();
        }

        public ActionResult ReportTemplate(int id)
        {
            int Width = 100;
            int Height = 650;
            string ReportDescription = "Performance Report";
            string ReportName = "ChequesReport";
            string reportServer = "http://sf-0024/ReportServer";
            string reportFolder = "WFARTHAChequesCaratula";

            var rptInfo = new ReportInfo
            {
                ReportId = id,
                ReportName = ReportName,
                ReportServer = reportServer,
                ReportFolder = reportFolder,
                ReportDescription = ReportDescription,
                ReportURL = String.Format("../../Reports/ReportTemplate.aspx?ReportName={0}&Height={1}&ReportServer={2}&ReportFolder={3}&ReportId={4}", ReportName, Height, reportServer, reportFolder, id),
                Width = Width,
                Height = Height
            };

            return View(rptInfo);
        }
    }
}