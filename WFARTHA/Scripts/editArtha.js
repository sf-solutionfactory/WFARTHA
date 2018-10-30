var tRet = [];//Agrego a un array los tipos de retenciones
var tRet2 = [];
$(document).ready(function () {
    var elem = document.querySelectorAll('select');
    var instance = M.Select.init(elem, []);

    //Formato a campo tipo_cambio
    var _Tc = $('#TIPO_CAMBIO').val();
    $('#TIPO_CAMBIO').val(toShow(_Tc));
    //Inicializar las tabs
    $('#tabs').tabs();

    solicitarDatos();
    $('#btn_guardarh').on("click", function (e) {
        //Guardar los valores de la tabla en el modelo para enviarlos al controlador
        copiarTableInfoControl(); //copiarTableInfoPControl();
        //copiarTableSopControl();
        copiarTableRet();

        //CODIGO
        //dar formato al monto
        var enca_monto = $("#MONTO_DOC_MD").val();
        enca_monto = enca_monto.replace(/\s/g, '');
        //enca_monto = toNum(enca_monto);
        //enca_monto = parseFloat(enca_monto);
        $("#MONTO_DOC_MD").val(enca_monto);

        //LEJ 11.09.2018
        //dar formato al T CAMBIO
        var tcambio = $("#TIPO_CAMBIO").val();
        tcambio = tcambio.replace(/\s/g, '');
        tcambio = toNum(tcambio);
        tcambio = parseFloat(tcambio);
        $("#TIPO_CAMBIO").val(tcambio);

        //Termina provisional
        $('#btn_guardar').click();
    });

    $('.btnD').on("click", function (e) {
        var val = $(this).val();
        $('#archivo').val(val);
        $('#btnDownload').trigger("click");
    });
});

function copiarTableInfoControl() {

    var lengthT = $("table#table_info tbody tr[role='row']").length;
    var docsenviar = {};
    var docsenviar2 = {};
    var docsenviar3 = {};//lej01.10.2018
    if (lengthT > 0) {
        //Obtener los valores de la tabla para agregarlos a la tabla oculta y agregarlos al json
        //Se tiene que jugar con los index porque las columnas (ocultas) en vista son diferentes a las del plugin
        jsonObjDocs = [];
        jsonObjDocs2 = [];
        jsonObjDocs3 = [];//lej01.10.2018
        var i = 1;
        var t = $('#table_info').DataTable();
        //Lej 14.09.18---------------------
        //Aqui armo la tabla oculta de acuerdo a los valores y columnas ingresados de retencion
        var taInf = $("#table_inforeth");
        taInf.append($("<thead />"));
        taInf.append($("<tbody />"));
        var thead = $("#table_inforeth thead");
        thead.append($("<tr />"));
        //for (y = 0; y < tRet2.length; y++) {
        //$("#table_inforeth>thead>tr").append("<th>" + tRet2[i] + " B.Imp.</th>");//Base imponible
        //$("#table_inforeth>thead>tr").append("<th>" + tRet2[i] + " I. Ret.</th>");//Imp Ret
        $("#table_inforeth>thead>tr").append("<th>WITHT</th>");
        $("#table_inforeth>thead>tr").append("<th>WT_WITHCD</th>");
        $("#table_inforeth>thead>tr").append("<th>I. Ret.</th>");//Imp Ret
        $("#table_inforeth>thead>tr").append("<th>B.Imp.</th>");//Base imponible
        // }
        //Lej 14.09.18----------------
        $("#table_info > tbody  > tr[role='row']").each(function () {

            //Obtener el row para el plugin
            var tr = $(this);
            var indexopc = t.row(tr).index();

            var tconcepto = "";
            //Obtener el concepto
            var inpt = t.row(indexopc).data()[9];
            //LEJ 03-10-2018
            if (inpt !== "") {
                var parser = $($.parseHTML(inpt));
                tconcepto = parser.val();
            }
            else {
                tconcepto = "";
            }
            //LEJ 03-10-2018
            //MGC 11-10-2018 Obtener valor de columnas ocultas --------------------------->
            //Obtener la cuenta
            var cuenta = t.row(indexopc).data()[11];

            //Obtener la imputación
            var imputacion = t.row(indexopc).data()[14];

            //MGC 22-10-2018 Modificación en etiquetas
            //Obtener el nombre de la cuenta
            var cuentanom = t.row(indexopc).data()[12];

            //MGC 11-10-2018 Obtener valor de columnas ocultas <---------------------------
            //Lej 14.08.2018-------------------------------------------------------------I
            var colsAdded = tRet2.length;//Las retenciones que se agregaron a la tabla
            var retTot = tRet.length;//Todas las retenciones
            //Lej 14.08.2018-------------------------------------------------------------T
            var pos = toNum($(this).find("td.POS").text());
            // var ca = $(this).find("td.CA").text(); //MGC 04092018 Conceptos
            var ca = t.row(indexopc).data()[7];//lejgg 09-10-2018 Conceptos
            var factura = $(this).find("td.FACTURA input").val();
            //var tconcepto = $(this).find("td.TCONCEPTO").text();
            var grupo = $(this).find("td.GRUPO input").val();

            //quitar espacios en blanco //MGC 22-10-2018 Modificación en etiquetas
            grupo = grupo.replace(/\s/g, '');
            var grupoaux = grupo;
            grupo = "";

            //Quitar el tipo de concepto de la llave
            grupo = grupoaux.substring(2, grupoaux.length);

            //var cuenta = $(this).find("td.CUENTA").text();//MGC 04092018 Conceptos //MGC 11-10-2018 Obtener valor de columnas oculta
            //var cuentanom = $(this).find("td.CUENTANOM").text();//MGC 22-10-2018 Modificación en etiquetas
            //var tipoimp = $(this).find("td.TIPOIMP").text();//MGC 22-10-2018 Modificación en etiquetas
            var tipoimp = t.row(indexopc).data()[13];//MGC 22-10-2018 Modificación en etiquetas

            //var imputacion = $(this).find("td.IMPUTACION").text(); //MGC 11-10-2018 Obtener valor de columnas oculta
            var ccosto = $(this).find("td.CCOSTO input").val(); //MGC 11-10-2018 Obtener valor de columnas oculta
            var impuesto = $(this).find("td.IMPUESTO input").val();
            var monto1 = $(this).find("td.MONTO input").val();
            monto1 = monto1.replace(/\s/g, '');
            var monto = toNum(monto1);
            var iva1 = $(this).find("td.IVA input").val();
            iva1 = iva1.replace(/\s/g, '');
            var iva = toNum(iva1);
            var total1 = $(this).find("td.TOTAL input").val();
            var texto = $(this).find("td.TEXTO input").val();//LEJ 14.09.2018
            total1 = total1.replace(/\s/g, '');
            var total = toNum(total1);
            //Para anexos
            //-----------------------

            var item3 = {};
            var an1 = $(this).find("td.NumAnexo input").val();
            var an2 = $(this).find("td.NumAnexo2 input").val();
            var an3 = $(this).find("td.NumAnexo3 input").val();
            var an4 = $(this).find("td.NumAnexo4 input").val();
            var an5 = $(this).find("td.NumAnexo5 input").val();
            item3["a1"] = an1;
            item3["a2"] = an2;
            item3["a3"] = an3;
            item3["a4"] = an4;
            item3["a5"] = an5;
            jsonObjDocs3.push(item3);
            item3 = "";
            //-----------------------
            for (j = 0; j < tRet2.length; j++) {
                //var xvl = $(this).find("td.BaseImp" + tRet2[j] + " input").val();
                //baseImp.push($(this).find("td.BaseImp" + tRet2[j] + " input").val());//LEJ 14.09.2018
                //ImpRet.push($(this).find("td.ImpRet" + tRet2[j] + " input").val());//LEJ 14.09.2018
                //llenare mis documentorp's
                var item2 = {};
                item2["NUM_DOC"] = 0;
                item2["POS"] = pos;
                item2["WITHT"] = tRet2[j];
                item2["WT_WITHCD"] = "01";
                item2["BIMPONIBLE"] = parseFloat($(this).find("td.BaseImp" + tRet2[j] + " input").val().replace('$', '').replace(',', ''));
                item2["IMPORTE_RET"] = parseFloat($(this).find("td.ImpRet" + tRet2[j] + " input").val().replace('$', '').replace(',', ''));
                jsonObjDocs2.push(item2);
                item2 = "";
            }

            var item = {};

            item["NUM_DOC"] = 0;
            item["POS"] = pos;
            item["ACCION"] = ca;
            item["FACTURA"] = factura;
            item["TCONCEPTO"] = tconcepto;
            item["GRUPO"] = grupo;
            item["CUENTA"] = cuenta;
            item["NOMCUENTA"] = cuentanom;
            item["TIPOIMP"] = tipoimp;
            item["IMPUTACION"] = imputacion;
            item["CCOSTO"] = ccosto;
            item["MONTO"] = monto;
            item["MWSKZ"] = impuesto;
            item["IVA"] = iva;
            item["TEXTO"] = texto;
            item["TOTAL"] = total;

            jsonObjDocs.push(item);
            i++;
            item = "";

        });

        docsenviar = JSON.stringify({ 'docs': jsonObjDocs });

        $.ajax({
            type: "POST",
            url: '../getPartialCon',
            contentType: "application/json; charset=UTF-8",
            data: docsenviar,
            success: function (data) {

                if (data !== null || data !== "") {

                    $("table#table_infoh tbody").append(data);
                }

            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                M.toast({ html: httpStatusMessage });
            },
            async: false
        });

        docsenviar2 = JSON.stringify({ 'docs': jsonObjDocs2 });

        //Ajax para las retenciones en la tabla de info
        $.ajax({
            type: "POST",
            url: '../getPartialCon2',
            contentType: "application/json; charset=UTF-8",
            data: docsenviar2,
            success: function (data) {

                if (data !== null || data !== "") {

                    $("table#table_inforeth tbody").append(data);
                }

            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                M.toast({ html: httpStatusMessage });
            },
            async: false
        });

        docsenviar3 = JSON.stringify({ 'docs': jsonObjDocs3 });
        $.ajax({
            type: "POST",
            url: '../getPartialCon3',
            contentType: "application/json; charset=UTF-8",
            data: docsenviar3,
            success: function (data) {

                if (data !== null || data !== "") {

                    $("table#table_infoAnex tbody").append(data);
                }

            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                M.toast({ html: httpStatusMessage });
            },
            async: false
        });

    }

}

function copiarTableSopControl() {
    var lengthT = $("table#table_sop tbody tr[role='row']").length;

    if (lengthT > 0) {
        //Obtener los valores de la tabla para agregarlos a la tabla oculta y agregarlos al json
        //Se tiene que jugar con los index porque las columnas (ocultas) en vista son diferentes a las del plugin
        jsonObjDocs = [];
        var i = 1;


        $("#table_sop > tbody  > tr[role='row']").each(function () {

            //Obtener el id de la categoría            
            var t = $('#table_sop').DataTable();
            var tr = $(this);

            var indexopc = t.row(tr).index();
            var opc = t.row(indexopc).data()[1];
        });

        docsenviar = JSON.stringify({ 'docs': jsonObjDocs });

        $.ajax({
            type: "POST",
            url: 'getPartialDis',
            contentType: "application/json; charset=UTF-8",
            data: docsenviar,
            success: function (data) {

                if (data !== null || data !== "") {

                    $("table#table_dish tbody").append(data);
                    if (borrador != "X") { //B20180625 MGC 2018.07.03
                        $('#delRow').click();
                    }
                }

            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                M.toast({ html: httpStatusMessage });
            },
            async: false
        });
    }
}

function copiarTableRet() {

    var lengthT = $("table#table_ret tbody tr[role='row']").length;
    var docsenviar = {};
    if (lengthT > 0) {
        //Obtener los valores de la tabla para agregarlos a la tabla oculta y agregarlos al json
        //Se tiene que jugar con los index porque las columnas (ocultas) en vista son diferentes a las del plugin
        jsonObjDocs = [];
        var i = 1;
        var t = $('#table_ret').DataTable();


        $("#table_ret > tbody  > tr[role='row']").each(function () {
            //Obtener el row para el plugin
            var tr = $(this);
            var indexopc = t.row(tr).index();

            //Obtener la sociedad oculta
            var socret = t.row(indexopc).data()[0];
            //Obtener el proveedor oculto
            var provr = t.row(indexopc).data()[1];
            var ret = $(this).find("td.TRET").text();
            var descret = $(this).find("td.DESCTRET").text();
            var indret = $(this).find("td.INDRET").text();
            var bimp = $(this).find("td.BIMPONIBLE").text();
            var tipoimp = $(this).find("td.IMPRET").text();

            bimp = bimp.replace(/\s/g, '');
            bimp = toNum(bimp);

            var _bimp = parseFloat(toNum(bimp));

            tipoimp = tipoimp.replace(/\s/g, '');
            tipoimp = toNum(tipoimp);

            var _tipoimp = parseFloat(toNum(tipoimp));

            var item = {};

            item["DESC"] = descret;
            item["WITHT"] = ret;
            item["WT_WITHCD"] = indret;
            item["POS"] = i;
            item["BIMPONIBLE"] = _bimp;
            item["IMPORTE_RET"] = _tipoimp;
            item["LIFNR"] = provr;
            item["BUKRS"] = socret;
            jsonObjDocs.push(item);
            i++;
            item = "";

        });

        docsenviar = JSON.stringify({ 'docs': jsonObjDocs });

        $.ajax({
            type: "POST",
            url: '../getPartialRet',
            contentType: "application/json; charset=UTF-8",
            data: docsenviar,
            success: function (data) {

                if (data !== null || data !== "") {

                    $("table#table_reth tbody").append(data);
                }

            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                M.toast({ html: httpStatusMessage });
            },
            async: false
        });
    }

}

function solicitarDatos() {
    var _ref = $('#REFERENCIA').val();
    $.ajax({
        type: "POST",
        url: '../getDocsPSTR',
        dataType: "json",
        data: { 'id': _ref },
        success: function (data) {
            if (data !== null || data !== "") {
                if (data !== "Null") {
                    //
                    armarTablaInfo(data);
                }
                else {
                    //
                }
            }
        },
        error: function (xhr, httpStatusMessage, customErrorMessage) {
            M.toast({ html: httpStatusMessage });
        },
        async: false
    });
}

function armarTablaInfo(datos) {
    var arrCols = [
        {
            "className": 'select_row',
            "data": null,
            "defaultContent": '',
            "orderable": false
        },
        {
            "name": 'POS',
            "className": 'POS',
            "orderable": false,
            "visible": false //MGC 04092018 Conceptos
        },
        {
            "name": 'NumAnexo',
            "className": 'NumAnexo',
            "orderable": false
        },
        {
            "name": 'NumAnexo2',
            "className": 'NumAnexo2',
            "orderable": false
        },
        {
            "name": 'NumAnexo3',
            "className": 'NumAnexo3',
            "orderable": false
        },
        {
            "name": 'NumAnexo4',
            "className": 'NumAnexo4',
            "orderable": false
        },
        {
            "name": 'NumAnexo5',
            "className": 'NumAnexo5',
            "orderable": false
        },
        {
            "name": 'CA',
            "className": 'CA',
            "orderable": false,
            "visible": false
        },
        {
            "name": 'FACTURA',
            "className": 'FACTURA',
            "orderable": false
        },
        {
            "name": 'TCONCEPTO',
            "className": 'TCONCEPTO',
            "orderable": false
        },
        {
            "name": 'GRUPO',
            "className": 'GRUPO',
            "orderable": false
        },
        {
            "name": 'CUENTA',
            "className": 'CUENTA',
            "orderable": false,
            "visible": false//lej 11.09.2018
        },
        {
            "name": 'CUENTANOM',
            "className": 'CUENTANOM',
            "orderable": false,
            "visible": false//lej 11.09.2018
        },
        {
            "name": 'TIPOIMP',
            "className": 'TIPOIMP',
            "orderable": false
        },
        {
            "name": 'IMPUTACION',
            "className": 'IMPUTACION',
            "orderable": false,
            "visible": false//lej 11.09.2018
        },
        {
            "name": 'CCOSTO',
            "className": 'CCOSTO',
            "orderable": false

        },
        {
            "name": 'MONTO',
            "className": 'MONTO',
            "orderable": false
        },
        {
            "name": 'IMPUESTO',
            "className": 'IMPUESTO',
            "orderable": false
        },
        {
            "name": 'IVA',
            "className": 'IVA',
            "orderable": false
        },
        {
            "name": 'TEXTO',
            "className": 'TEXTO',
            "orderable": false
        }
    ];
    //Se rearmara la tabla en HTML
    var taInf = $("#table_info");
    taInf.append($("<thead />"));
    taInf.append($("<tbody />"));
    taInf.append($("<tfoot />"));
    var thead = $("#table_info thead");
    thead.append($("<tr />"));
    //Theads
    $("#table_info>thead>tr").append("<th></th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_pos\">Pos NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">Anexo</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">Anexo2</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">Anexo3</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">Anexo4</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">Anexo5</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_cargoAbono\">D/H NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_factura\">Factura NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_tconcepto\">TIPO CONCEPTO NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_grupo\">Grupo NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_cuenta\">Cuenta NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_cuentaNom\">Nombre de cuenta NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_tipoimp\">Tipo Imp. NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_imputacion\">Imputación NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_ccosto\">Centro de costo NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_monto\">Monto NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_impuesto\">Impuesto NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_iva\">IVA NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_Texto\">TEXTO</th>");
    var res = null;
    //----------------------
    //Hare un ajax para traer las columnas extras
    var _ref = $('#NUM_DOC').val();
    $.ajax({
        type: "POST",
        url: '../traerColsExtras',
        dataType: "json",
        data: { 'id': _ref },
        success: function (data) {
            if (data !== null || data !== "") {
                if (data !== "Null") {
                    //
                    res = data;
                }
                else {
                    //
                }
            }
        },
        error: function (xhr, httpStatusMessage, customErrorMessage) {
            M.toast({ html: httpStatusMessage });
        },
        async: false
    });
    var tRet = [];
    for (x = 0; x < res.length; x++) {
        tRet.push(res[x].WITHT);
    }
    //----------------------
    var colspan = 20;
    tRet2 = tRet;
    for (i = 0; i < tRet.length; i++) {//Revisare las retenciones que tienes ligadas
        $.ajax({
            type: "POST",
            url: '../getRetLigadas',
            data: { 'id': tRet[i] },
            dataType: "json",
            success: function (data) {
                if (data !== null || data !== "") {
                    if (data !== "Null") {
                        tRet2 = jQuery.grep(tRet2, function (value) {
                            return value !== data;
                        });
                    }
                    else {
                        //
                    }
                }
            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                M.toast({ html: httpStatusMessage });
            },
            async: false
        });
    }

    for (i = 0; i < tRet2.length; i++) {//Agregare las columnas extras
        $("#table_info>thead>tr").append("<th class=\"\">" + tRet2[i] + "B. I.</th>");
        $("#table_info>thead>tr").append("<th class=\"\">" + tRet2[i] + "I. R.</th>");
        colspan++;
        colspan++;
    }
    $("#table_info>thead>tr").append("<th class=\"lbl_total\">Total</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_check\">Check</th>");
    //Tfoot       
    var tfoot = $("#table_info tfoot");
    tfoot.append($("<tr />"));
    $("#table_info>tfoot>tr").append("<th colspan=\"" + colspan + "\" style=\"text-align:right\">Total:</th>");
    $("#table_info>tfoot>tr").append("<th id=\"total_info\"></th>");
    //Se hara un push al arreglo de columnas original
    for (i = 0; i < tRet2.length; i++) {
        arrCols.push({
            "name": tRet2[i] + " B.Imp.",
            "orderable": false
        }, {
                "name": tRet2[i] + " I. Ret.",
                "orderable": false
            });
    }
    //Lej 17.09.18
    //Para agregar columna texto al final
    arrCols.push({
        "name": 'TOTAL',
        "className": 'TOTAL',
        "orderable": false
    });
    //solicitud con orden de compra
    arrCols.push({
        "name": 'CHECK',
        "className": 'CHECK',
        "orderable": false
    });

    //Lej 17.09.18
    extraCols = tRet2.length;
    $('#table_info').DataTable({
        scrollX: true,
        scrollCollapse: true,
        language: {
            "url": "../Scripts/lang/ES.json"
        },
        "destroy": true,
        "paging": false,
        "info": false,
        "searching": false,
        "columns": arrCols
    });

    //LEJ16102018
    //traigo los campos de la tabla de detalle nt de la parte de baseimpoinle e importe de retencion
    var _infoBIIR = [];
    var _infoAnex = [];
    $.ajax({
        type: "POST",
        url: '../getDocsPr',
        dataType: "json",
        data: { 'id': _ref },
        success: function (data) {
            if (data !== null || data !== "") {
                _infoBIIR = data;
            }
        },
        error: function (xhr, httpStatusMessage, customErrorMessage) {
            M.toast({ html: httpStatusMessage });
        },
        async: false
    });

    $.ajax({
        type: "POST",
        url: '../getAnexos',
        dataType: "json",
        data: { 'id': _ref },
        success: function (data) {
            if (data !== null || data !== "") {
                _infoAnex = data;
            }
        },
        error: function (xhr, httpStatusMessage, customErrorMessage) {
            M.toast({ html: httpStatusMessage });
        },
        async: false
    });
    var _infoc = _infoBIIR.length / 2;
    var arrColExTA = [];


    if (_infoc === datos.DOCUMENTOPSTR.length) {
        for (var i = 0; i < datos.DOCUMENTOPSTR.length; i++) {
            for (var x = 0; x < _infoBIIR.length; x++) {
                if (_infoBIIR[x].POS === (i + 1)) {
                    arrColExTA.push(_infoBIIR[x]);
                }
            }
            if (datos.DOCUMENTOPSTR[i].TEXTO === null) {
                datos.DOCUMENTOPSTR[i].TEXTO = "";
            }
            if (datos.DOCUMENTOPSTR[i].IMPUTACION === null) {
                datos.DOCUMENTOPSTR[i].IMPUTACION = "";
            }
            if (_infoAnex.length > 0) {
                addRowInfo($('#table_info').DataTable(), datos.DOCUMENTOPSTR[i].POS, _infoAnex[i].a1, _infoAnex[i].a2, _infoAnex[i].a3, _infoAnex[i].a4, _infoAnex[i].a5, datos.DOCUMENTOPSTR[i].ACCION, datos.DOCUMENTOPSTR[i].FACTURA, "", datos.DOCUMENTOPSTR[i].GRUPO, datos.DOCUMENTOPSTR[i].CUENTA,
                    datos.DOCUMENTOPSTR[i].NOMCUENTA, datos.DOCUMENTOPSTR[i].TIPOIMP, datos.DOCUMENTOPSTR[i].IMPUTACION, "", datos.DOCUMENTOPSTR[i].MONTO, "", datos.DOCUMENTOPSTR[i].IVA, datos.DOCUMENTOPSTR[i].TEXTO, datos.DOCUMENTOPSTR[i].TOTAL, "", "", arrColExTA);
            }
            else {
                addRowInfo($('#table_info').DataTable(), datos.DOCUMENTOPSTR[i].POS, "", "", "", "", "", datos.DOCUMENTOPSTR[i].ACCION, datos.DOCUMENTOPSTR[i].FACTURA, "", datos.DOCUMENTOPSTR[i].GRUPO, datos.DOCUMENTOPSTR[i].CUENTA,
                    datos.DOCUMENTOPSTR[i].NOMCUENTA, datos.DOCUMENTOPSTR[i].TIPOIMP, datos.DOCUMENTOPSTR[i].IMPUTACION, "", datos.DOCUMENTOPSTR[i].MONTO, "", datos.DOCUMENTOPSTR[i].IVA, datos.DOCUMENTOPSTR[i].TEXTO, datos.DOCUMENTOPSTR[i].TOTAL, "", "", arrColExTA);
            }
        }
    }

}

function addRowInfo(t, POS, NumAnexo, NumAnexo2, NumAnexo3, NumAnexo4, NumAnexo5, CA, FACTURA, TIPO_CONCEPTO, GRUPO, CUENTA, CUENTANOM, TIPOIMP, IMPUTACION, CCOSTO, MONTO, IMPUESTO, IVA, TEXTO, TOTAL, disabled, check, colsBIIR) { //MGC 03 - 10 - 2018 solicitud con orden de compra

    var r = addRowl(
        t,
        POS,
        "<input class=\"NumAnexo\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo + "\">",
        "<input class=\"NumAnexo2\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo2 + "\">",
        "<input class=\"NumAnexo3\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo3 + "\">",
        "<input class=\"NumAnexo4\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo4 + "\">",
        "<input class=\"NumAnexo5\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo5 + "\">",
        CA,//MGC 04092018 Conceptos
        "<input " + disabled + " class=\"FACTURA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + FACTURA + "\">",
        TIPO_CONCEPTO,
        "<input " + disabled + " class=\"GRUPO GRUPO_INPUT\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + GRUPO + "\">",
        CUENTA,//MGC 04092018 Conceptos
        CUENTANOM,
        TIPOIMP,
        IMPUTACION,
        "<input disabled class=\"CCOSTO\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + CCOSTO + "\">",
        "<input " + disabled + " class=\"MONTO OPER\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + MONTO + "\">",
        "",
        "<input disabled class=\"IVA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + IVA + "\">",
        "<input " + disabled + " class=\"\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + TEXTO + "\">",//Lej 13.09.2018
        TOTAL,
        check, //MGC 03-10-2018 solicitud con orden de compra
        colsBIIR
    );

    return r;
}

function addRowl(t, pos, nA, nA2, nA3, nA4, nA5, ca, factura, tipo_concepto, grupo, cuenta, cuentanom, tipoimp, imputacion, ccentro, monto, impuesto,
    iva, texto, total, check, _dExtra) {
    //Lej 13.09.2018---
    var colstoAdd = "";
    for (i = 0; i < extraCols; i++) {
        colstoAdd += '<td class=\"BaseImp' + tRet2[i] + '\"><input class=\"extrasC BaseImp' + i + '\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"' + toShow(_dExtra[0].BIMPONIBLE) + '\"></td>';
        colstoAdd += '<td class=\"ImpRet' + tRet2[i] + '\"><input class=\"extrasC2 ImpRet' + i + '\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"' + toShow(_dExtra[0].IMPORTE_RET) + '\"></td>';

    }
    colstoAdd += "<td><input disabled class=\"TOTAL OPER\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + total + "\"></td>"
        + "<td><p><label><input type=\"checkbox\" checked=\"" + check + "\" /><span></span></label></p></td>";//MGC 03 - 10 - 2018 solicitud con orden de compra
    var table_rows = '<tr><td></td><td>' + pos + '</td><td>' + nA + '</td><td>' + nA2 + '</td><td>' + nA3 + '</td><td>' + nA4 + '</td><td>' + nA5 + '</td><td>' +
        ca + '</td><td>' + factura + '</td><td>' + tipo_concepto
        + '</td><td>' + grupo + '</td><td>' + cuenta + '</td><td>' + cuentanom + '</td><td>' + tipoimp + '</td><td>' + imputacion
        + '</td><td>' + ccentro + '</td><td>' + monto + '</td><td>' + impuesto + '</td><td>' + iva + '</td><td>' + texto + '</td>' + colstoAdd + '</tr>';
    //Lej 13.09.2018--------------------------------
    if (extraCols === 0) {//Lej 13.09.2018
        var r = t.row.add([
            "",
            pos,
            nA,
            nA2,
            nA3,
            nA4,
            nA5,
            ca,
            factura,
            tipo_concepto,
            grupo,
            cuenta,
            cuentanom,
            tipoimp,
            imputacion,
            ccentro,
            monto,
            impuesto,
            iva,
            texto,
            "<input disabled class=\"TOTAL OPER\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + total + "\">",
            "<input class=\"CHECK\" style=\"font-size:12px;\" type=\"checkbox\" id=\"\" name=\"\" value=\"" + check + "\">" //MGC 03 - 10 - 2018 solicitud con orden de compra
        ]).draw(false).node();
    } else {
        var r = t.row.add(
            $(table_rows)//Lej 15.09.2018
        ).draw(false).node();
    }

    return r;
}

function updateFooter() {
    resetFooter();

    var t = $('#table_info').DataTable();
    var total = 0;

    $("#table_info > tbody > tr[role = 'row']").each(function (index) {
        //var col11 = $(this).find("td.TOTAL input").val();
        var col11 = $(this).find("td.TOTAL input").val();

        //Saber si el renglón se va a sumar
        var tr = $(this);
        var indexopc = t.row(tr).index();

        //Obtener la accion
        var ac = t.row(indexopc).data()[2];



        col11 = col11.replace(/\s/g, '');
        var val = toNum(col11);
        val = convertI(val);
        if ($.isNumeric(val)) {
            if (ac != "H") {
                total += val;
            }
        }
    });

    total = total.toFixed(2);

    $('#total_info').text(toShow(total));
    $('#MONTO_DOC_MD').val(toShow(total));//Lej 18.09.2018
    $('#mtTot').val($('#MONTO_DOC_MD').val());//Lej 29.09.2018
}

function resetTabs() {

    var ell = document.getElementById("tabs");
    var instances = M.Tabs.getInstance(ell);

    var active = $('.tabs').find('.active').attr('href');
    active = active.replace("#", "");
    instances.select(active);
    //instances.updateTabIndicator
}

