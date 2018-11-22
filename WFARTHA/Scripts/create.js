﻿//Variables globales
var posinfo = 0;
var proveedorValC = "";
var conceptoValC = "";
var extraCols = 0;
var tRet = [];//Agrego a un array los tipos de retenciones
var tRet2 = [];//Agrego a un array los tipos de retenciones que no tienen ligadas

$(document).ready(function () {
    //LEJ 11.09.2018------------------------------------
    //Iniciar todos los selects
    var elem = document.querySelectorAll('select');
    var instance = M.Select.init(elem, []);
    $.ajax({
        type: "POST",
        url: 'getImpDesc',
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            if (data !== null || data !== "") {
                // $("#IMPUESTO").empty();
                var ddlI = $("#IMPUESTO");
                $.each(data, function (i, dataj) {
                    //ddlI.append($("<option />").val(dataj.imp).text(dataj.imp + " - " + dataj.txt));
                })
                //var elem = document.querySelectorAll('select');
                //var instance = M.Select.init(elem, []);
            }
        },
        error: function (xhr, httpStatusMessage, customErrorMessage) {
            M.toast({ html: httpStatusMessage });
        },
        async: false
    });
    //LEJ 11.09.2018------------------------------------

    //Establecer fechas
    $("#FECHADO").val($("#FECHAD").val());

    //Inicializar las tabs
    $('#tabs').tabs();

    $("label[for='PAYER_ID']").addClass("active");

    //Tabla de Información
    $('#table_info').DataTable({

        language: {
            //"url": "../Scripts/lang/@Session["spras"].ToString()" + ".json"
            "url": "../Scripts/lang/ES.json"
        },
        "paging": false,
        "info": false,
        "searching": false,
        "scrollX": true,
        "columns": [
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
                "name": 'A1',//MGC 22-10-2018 Etiquetas
                "className": 'NumAnexo',
                "orderable": false
            },
            {
                "name": 'A2',//MGC 22-10-2018 Etiquetas
                "className": 'NumAnexo2',
                "orderable": false
            },
            {
                "name": 'A3',//MGC 22-10-2018 Etiquetas
                "className": 'NumAnexo3',
                "orderable": false
            },
            {
                "name": 'A4',//MGC 22-10-2018 Etiquetas
                "className": 'NumAnexo4',
                "orderable": false
            },
            {
                "name": 'A5',//MGC 22-10-2018 Etiquetas
                "className": 'NumAnexo5',
                "orderable": false
            },
            {
                "name": 'TXTPOS',
                "className": 'TXTPOS',
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
                "orderable": false,
                "visible": false//MGC 22-10-2018 Etiquetas
            },
            {
                "name": 'CONCEPTO',
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
                "orderable": false,
                "visible": false//MGC 22-10-2018 Etiquetas
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
                "name": 'TOTAL',
                "className": 'TOTAL',
                "orderable": false
            },
            //MGC ADD 03-10-2018 solicitud con orden de compra
            {
                "name": 'CHECK',
                "className": 'CHECK',
                "orderable": false
            }
        ],
        columnDefs: [
            { targets: 2, width: '580px' },
            { targets: 3, width: '40px' },
            { targets: 4, width: '580px' },
            { targets: 5, width: '580px' },
            { targets: 6, width: '580px' },
            { targets: 19, width: '580px' }

        ]
    });

    //Tabla de Retenciones
    $('#table_ret').DataTable({
        scrollX: true,
        scrollCollapse: true,
        language: {
            "url": "../Scripts/lang/ES.json"
        },
        "paging": false,
        "info": false,
        "searching": false,
        "columns": [
            {
                "name": 'SOCRET',
                "className": 'SOCRET leftAlignement',
                "orderable": false,
                "visible": false
            },
            {
                "name": 'PROVRET',
                "className": 'PROVRET leftAlignement',
                "orderable": false,
                "visible": false
            },
            {
                "name": 'TRET',
                "className": 'TRET leftAlignement',
                "orderable": false
            },
            {
                "name": 'DESCRET',
                "className": 'DESCTRET leftAlignement',
                "orderable": false
            },
            {
                "name": 'INDRET',
                "className": 'INDRET leftAlignement',
                "orderable": false
            },
            {
                "name": 'BIMPONIBLE',
                "className": 'BIMPONIBLE leftAlignement',
                "orderable": false
            },
            {
                "name": 'IMPRET',
                "className": 'IMPRET leftAlignement',
                "orderable": false
            }
        ]
    });

    $('#table_sop').DataTable({

        language: {
            //"url": "../Scripts/lang/@Session["spras"].ToString()" + ".json"
            "url": "../Scripts/lang/ES.json"
        },
        "paging": false,
        "info": false,
        "searching": false,
        "columns": [
            {
                "className": 'select_row',
                "data": null,
                "defaultContent": '',
                "orderable": false
            },
            {
                "name": 'OPC',
                "className": 'OPC',
                "orderable": false,
                "visible": false
            },
            {
                "name": 'POS',
                "className": 'POS',
                "orderable": false,
            },
            {
                "name": 'RFC',
                "className": 'RFC',
                "orderable": false
            },
            {
                "name": 'FACTURA',
                "className": 'FACTURA',
                "orderable": false
            },
            {
                "name": 'FECHA',
                "className": 'FECHA',
                "orderable": false
            },

            {
                "name": 'MONTO',
                "className": 'MONTO',
                "orderable": false
            }
            ,
            {
                "name": 'IVA',
                "className": 'IVA',
                "orderable": false
            },
            {
                "name": 'TOTAL',
                "className": 'TOTAL',
                "orderable": false
            }
            ,
            {
                "name": 'ARCHIVO',
                "className": 'ARCHIVO',
                "orderable": false
            }
        ]
    });

    //Tabla de Anexos
    $('#table_anexa').DataTable({
        language: {
            //"url": "../Scripts/lang/@Session["spras"].ToString()" + ".json"
            "url": "../Scripts/lang/ES.json"
        },
        "paging": false,
        "info": false,
        "searching": false,
        "columns": [
            {
                "className": 'select_row',
                "data": null,
                "defaultContent": '',
                "orderable": false
            },
            {
                "name": 'POS',
                "className": 'POS',
                "orderable": false
            },
            {
                "name": 'STAT',
                "className": 'STAT',
                "orderable": false
            },
            {
                "name": 'NAME',
                "className": 'NAME',
                "orderable": false
            },
            {
                "name": 'TYPE',
                "className": 'TYPE',
                "orderable": false
            },
            {
                "name": 'DESC',
                "className": 'DESC',
                "orderable": false
            }
        ]
    });

    $('#addRowInfo').on('click', function () {

        var t = $('#table_info').DataTable();
        var addedRowInfo = addRowInfo(t, "1", "", "", "", "", "", "D", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");//Lej 13.09.2018 //MGC 03-10-2018 solicitud con orden de compra       
        posinfo++;

        //Obtener el select de impuestos en la cabecera
        var idselect = "infoSel" + posinfo;

        //Obtener el valor 
        var imp = $('#IMPUESTO').val();

        //MGC 04092018 Conceptos
        //Crear el nuevo select con los valores de impuestos
        addSelectImpuesto(addedRowInfo, imp, idselect, "", "X");


        updateFooter();
        event.returnValue = false;
        event.cancel = true;
        //tamanosRenglones();
    });

    $('#div-menu').on('click', function () {
        obtenerRetenciones(99);
    });

    $('#cerrar-menu').on('click', function () {
        obtenerRetenciones(99);
    });

    $('#delRowInfo').click(function (e) {
        var t = $('#table_info').DataTable();
        t.rows('.selected').remove().draw(false);
        updateFooter();
        event.returnValue = false;
        event.cancel = true;
    });

    $('#delRowAnex').click(function (e) {
        var t = $('#table_anexa').DataTable();
        t.rows('.selected').remove().draw(false);
        event.returnValue = false;
        event.cancel = true;
        //FRT 12112018  Para recorrer los numero borrados de los anexos
        var _num = t.rows().count();
        for (i = 1; i < _num + 1; i++) {
            document.getElementById("table_anexa").rows[i].cells[1].innerHTML = i;
        }
    });

    //MGC 30-10-2018 Tipo de presupuesto---------------------------------->
    //$('#table_info tbody').on('click', '.select_row', function () {
    //    var t = $('#table_info').DataTable();
    //    var tr = $(this).closest('tr');

    //    var indexopc = t.row(tr).index();

    //    //Obtener la accion
    //    var ac = t.row(indexopc).data()[2];

    //    if (ac != "H") {
    //        $(tr).toggleClass('selected');
    //    }

    //});
    //MGC 30-10-2018 Tipo de presupuesto----------------------------------<

    $('#table_anexa tbody').on('click', 'td.select_row', function () {
        var t = $('#table_info').DataTable();
        var tr = $(this).closest('tr');

        $(tr).toggleClass('selected');
        $(tr).css("background-color:#c4f0ff;");
    });

    $('#addRowSop').on('click', function () {

        $("#file_sop").trigger("click");

        event.returnValue = false;
        event.cancel = true;

    });

    $('#delRowSop').click(function (e) {
        var t = $('#table_sop').DataTable();
        t.rows('.selected').remove().draw(false);
        event.returnValue = false;
        event.cancel = true;
    });

    $('#table_sop tbody').on('click', 'td.select_row', function () {
        var tr = $(this).closest('tr');

        $(tr).toggleClass('selected');

    });

    //FRT14112018.3 Se añade para obtener el Tipo de Cambio
    $("#MONEDA_ID").change(function () {
        var moneda = $('#MONEDA_ID Option:Selected').val();
        var fecha = $('#FECHAD').val();
        //var fecha = "12/08/2018";
        if (moneda.substring(0, 3) == "USD") {
            tipocambio = getTipoCambio(moneda, fecha);
            $("#TIPO_CAMBIO").val(tipocambio);
        } else {
            $('#TIPO_CAMBIO').val(0)
        }

    });

    //Archivo para tabla de distribución
    $("#file_sop").change(function () {
        var filenum = $('#file_sop').get(0).files.length;
        if (filenum > 0) {
            var file = document.getElementById("file_sop").files[0];
            var filename = file.name;
            M.toast({ html: 'Cargando ' + filename });

            var t = $('#table_sop').DataTable();
            var addClase = "";
            var addedRowSop = "";
            //Cargando .xml
            if (evaluarExt(filename)) {

                addedRowSop = addRowSopF(t, "FA", "1", "AVG00RR55", "J9993", "2018-08-20", "$67536.00", "$12864.00", "$80400.00", filename);

                //Cargando cualquier archivo
            } else {

                addedRowSop = addRowSopF(
                    t,
                    "OT",
                    "1",
                    "<input class=\"RFC\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\">",
                    "<input class=\"FACTURA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\">",
                    "<input class=\"FECHA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\">",
                    "<input class=\"MONTO\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\">",
                    "<input disabled class=\"IVA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\">",
                    "<input class=\"TOTAL\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\">",
                    filename);

            }

            //Clear para archivo
            clearFile();

        } else {
            M.toast({ html: 'Seleccione un archivo' });
        }
    });

    $('#btn_guardarh').on("click", function (e) {

        //M.toast({ html: "Guardando" })
        //document.getElementById("loader").style.display = "flex";//RSG 26.04.2018
        //document.getElementById("btn_guardarh").classList.add("disabled");//RSG 26.04.2018

        var _miles = $("#miles").val();
        var _decimales = $("#dec").val();

        //FRT06112018.3 Se comentan las lineas se pasan a ejecucion despues de validar los valores
        //copiarTableInfoControl();
        //copiarTableInfoPControl();
        //copiarTableRet();
        //end FRT06112018.3 

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

        //FRT 05112018

        var _b = false;
        var _vs = [];
        var msgerror = "";
        var _rni = 0;
        //Validar que los anexos existan
        $("#table_anexa > tbody  > tr[role='row']").each(function () {
            var pos = $(this).find("td.POS").text();
            _vs.push(pos);
        });


        //LEJGG 23-10-18
        //Aqui verificare si es invoice o factura
        var val3 = $('#tsol').val();
        val3 = "[" + val3 + "]";
        val3 = val3.replace("{", "{ \"");
        val3 = val3.replace("}", "\" }");
        val3 = val3.replace(/\,/g, "\" , \"");
        val3 = val3.replace(/\=/g, "\" : \"");
        val3 = val3.replace(/\ /g, "");
        var jsval = $.parseJSON(val3);
        if (jsval[0].ID === "SSO") {
            var res = validarFacs();//Lejgg 23-10-2018
            if (res) {//si es true signfica que si hay factura
                //Fechade la factura
                var _fdo = $("#FECHADO").val();
            } else {
                //si es false signfica que es invoice(fecha de la creacion)
                var fdo = $("#FECHADO").val();
            }

        }




        //$("#table_info > tbody  > tr[role='row']").each(function () { //MGC 24-10-2018 Conflicto Enrique-Rogelio
        var t = $('#table_info').DataTable();
        var tabble = "table_info";
        if ($("table#table_info tbody tr[role='row']").length === 0) { tabble = "table_infoP"; }
        $("#" + tabble + " > tbody  > tr[role='row']").each(function () {

            _rni++;
            //Obtener valores visibles en la tabla
            var na1 = $(this).find("td.NumAnexo input").val();
            var na2 = $(this).find("td.NumAnexo2 input").val();
            var na3 = $(this).find("td.NumAnexo3 input").val();
            var na4 = $(this).find("td.NumAnexo4 input").val();
            var na5 = $(this).find("td.NumAnexo5 input").val();

            //frt05112018 validacion de CECOS vacion en Tipo Imp. "K"
            var ceco = $(this).find("td.CCOSTO input").val();
            var tr = $(this);
            var indexopc = t.row(tr).index();

            var tipoimp = t.row(indexopc).data()[14];

            if (tipoimp == "K" & (ceco == "" | ceco == null)) {
                msgerror = "Falta ingresar Centro de Costo";
                _b = false;
            } else {
                _b = true;
            }
            if (_b === false) {
                return false;
            }

            //FRT20112018 iNGRESAR VALIDACION DE CONCEPTO
            //var concepto = t.row(indexopc).data()[13];
            var concepto = $(this).find("td.GRUPO input").val(); //FRT21112018

            if (concepto == "" | concepto == null) {
                msgerror = "Falta ingresar Conecepto";
                _b = false;
            } else {
                _b = true;
            }
            if (_b === false) {
                return false;
            }
            //ENDFRT20112018 iNGRESAR VALIDACION DE CONCEPTO

            //FRT06112018.3 Se realizara validación del monto > 0
            var monto = $(this).find("td.MONTO input").val();

            if (monto == "$ 0.00" | monto == null | monto == "") { //MGC 07-11-2018 Validación en el monto
                msgerror = "El monto debe ser MAYOR a cero";
                _b = false;
            } else {
                _b = true;
            }
            if (_b === false) {
                return false;
            }
            //END FRT06112018.3

            if (_vs.length > 0) {
                for (var i = 0; i < _vs.length; i++) {
                    if (na1 === _vs[i] || na1 === "") {
                        _b = true;
                        break;
                    } else {
                        _b = false;
                        msgerror = "Error en el renglon " + _rni + " valor: " + na1 + " Columna 2";
                    }
                }
                if (_b === false) {
                    return false;
                }
                for (var i2 = 0; i2 < _vs.length; i2++) {
                    if (na2 === _vs[i2] || na2 === "") {
                        _b = true;
                        break;
                    } else {
                        _b = false;
                        msgerror = "Error en el renglon " + _rni + " valor: " + na2 + " Columna 3";
                    }
                }
                if (_b === false) {
                    return false;
                }
                for (var i3 = 0; i3 < _vs.length; i3++) {
                    if (na3 === _vs[i3] || na3 === "") {
                        _b = true;
                        break;
                    } else {
                        _b = false;
                        msgerror = "Error en el renglon " + _rni + " valor: " + na3 + " Columna 4";
                    }
                }
                if (_b === false) {
                    return false;
                }
                for (var i4 = 0; i4 < _vs.length; i4++) {
                    if (na4 === _vs[i4] || na4 === "") {
                        _b = true;
                        break;
                    } else {
                        _b = false;
                        msgerror = "Error en el renglon " + _rni + " valor: " + na4 + " Columna 5";
                    }
                }
                if (_b === false) {
                    return false;
                }
                for (var i5 = 0; i5 < _vs.length; i5++) {
                    if (na5 === _vs[i5] || na5 === "") {
                        _b = true;
                        break;
                    } else {
                        _b = false;
                        msgerror = "Error en el renglon " + _rni + " valor: " + na5 + " Columna 6";
                    }
                }
                if (_b === false) {
                    return false;
                }
            } else {
                _b = true;
            }
        });


        //FRT08112018 Valida con otra letra para evitar error
        //FRT04112018.2 Se realizara validación del monto > 0s
        var proveedor = $("#PAYER_ID").val();
        if (proveedor == "" | proveedor == null) {
            //mensaje de error
            msgerror = "No se ha seleccionado proveedor";
            _p = false;
        } else {
            _p = true;
        }
        //update codigo fer
        //END FRT04112018.2


        //FRT21112018 Para validar cantidad de anexos solamente al enviar
        var borrador = $("#borr").val();
        var lengthT = $("table#table_anexa tbody tr[role='row']").length;    
        _a = true;
        if (borrador != "B") {
            if (lengthT == 0) {
                msgerror = "Es necesario agregar por lo menos 1 Anexo";
                _a = false;
            } else {
                _a = true;
            }
        } 

        //ENDFRT21112018

        if (_p) {
            if (_b) {
                if (_a) {
                    //FRT06112018.3 Se pasa la ejecucion de estas lineas para su actualizacion
                    copiarTableInfoControl();
                    copiarTableInfoPControl();
                    copiarTableAnexos(); //FRT12112018 se agrega para poder realzar barrido de archivos en tablaanexos
                    copiarTableRet();
                    //end FRT06112018.3 
                    $('#btn_guardar').trigger("click");
                } else {
                    M.toast({ html: msgerror });
                }
                
            } else {
                M.toast({ html: msgerror });
            }
        } else {
            M.toast({ html: msgerror });
        }
        ///FRT08112018

    });

    $('#btn_borradorh').on("click", function (e) {
        document.getElementById("loader").style.display = "initial";
        guardarBorrador(false);
        document.getElementById("loader").style.display = "none";
    });

    //Archivo para facturas en soporte ahora información
    $("#file_sopp").change(function () {
        var filenum = $('#file_sopp').get(0).files.length;
        if (filenum > 0) {
            var file = document.getElementById("file_sopp").files[0];
            var filename = file.name;
            if (true) {
                M.toast({ html: 'Cargando ' + filename });
                loadExcelSop(file);
            } else {
                M.toast({ html: 'Tipo de archivo incorrecto: ' + filename });
            }
        } else {
            M.toast({ html: 'Seleccione un archivo' });
        }
    });

    //MGC 04092018 Conceptos
    $('#tab_con').on("click", function (e) {

        ////Definir si se va a agregar un nuevo renglón H o se va a actualizar
        //var newr = false;
        //newr = verificarRowH(); //False quiere decir que ya existe
        ////MGC 04092018 Conceptos
        //if (newr) {
        //    addRowInfoH();    //--Codigolej
        //} else {
        //    updRowInfoH();    //--Codigolej
        //}

    });

    $('#file_sopAnexar').change(function () {

        ////FRT 13112018 PARA PODER SUBIR LOS ARCHIVOS A CAREPETA TEMPORAL
        var lengthtemp = $(this).get(0).files.length;

        for (var t = 0; t < lengthtemp; t++) {
            var filetemp = $(this).get(0).files[t];
            var datatemp = new FormData();
            datatemp.append('file', filetemp);
            $.ajax({
                type: "POST",
                url: 'subirTemporal',
                data: datatemp,
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                success: function (datatemp) {
                    if (datatemp !== null || datatemp !== "") {
                        var valida = datatemp;
                    }
                },
                error: function (xhr, httpStatusMessage, customErrorMessage) {
                    M.toast({ html: httpStatusMessage });
                },
                async: false
            });
        }



        //END FRT13112018
        //Validacion para saber si es sin orden de compra o reembolso
        var val3 = $('#tsol').val();
        val3 = "[" + val3 + "]";
        val3 = val3.replace("{", "{ \"");
        val3 = val3.replace("}", "\" }");
        val3 = val3.replace(/\,/g, "\" , \"");
        val3 = val3.replace(/\=/g, "\" : \"");
        val3 = val3.replace(/\ /g, "");
        var jsval = $.parseJSON(val3);
        if (jsval[0].ID === "SSO") {
            var length = $(this).get(0).files.length;
            var tdata = "";
            var _tab = $('#table_anexa').DataTable();
            for (var i = 0; i < length; i++) {
                var nr = _tab.rows().count();
                //Si nr es 0 significa que la tabla esta vacia
                if (nr === 0) {
                    var file = $(this).get(0).files[i];
                    var fileName = file.name;
                    var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
                    tdata = "<tr><td></td><td>" + (i + 1) + "</td><td>OK</td><td>" + file.name + "</td><td>" + fileNameExt + "</td><td><input name=\"labels_desc\" class=\"Descripcion\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td></tr>";
                    //Lejgg 22-10-2018
                    if (fileNameExt.toLowerCase() === "xml") {
                        var data = new FormData();
                        var _fbool = false;
                        var _resVu = false;
                        data.append('file', file);
                        $.ajax({
                            type: "POST",
                            url: 'procesarXML',
                            data: data,
                            dataType: "json",
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                //FRT20112018 Para validar los RFC
                                if (data[0] == "1") {
                                    _bcorrecto = true;
                                    _resVu = validarUuid(data[5]);
                                    if (!_resVu) {
                                        _bemisor = validarRFCEmisor(data[4]);
                                        _breceptor = validarRFCReceptor(data[3], data[7]);
                                        if (_bemisor & _breceptor) {
                                            $('#Uuid').val(data[5]);
                                            $('#FECHAD').val(data[1]);
                                            $('#FECHADO').val(data[1]);
                                            $("#FECHAD").trigger("change");
                                            data[2];//Monto Total
                                            //FRT14112018.3 Para Tipo de Cambio en XML
                                            if (data[6] != "MXN") {
                                                tipo = data[8];
                                                $('#TIPO_CAMBIO').val(tipo);
                                                $('#TIPO_CAMBIO').trigger("change");
                                                var objSelect = document.getElementById("MONEDA_ID");
                                                objSelect.options[1].selected = true;
                                            }
                                        }
                                    }

                                } else {
                                    _bcorrecto = false;
                                }
                            },
                            error: function (xhr, httpStatusMessage, customErrorMessage) {
                                //
                            },
                            async: false
                        });
                    }
                    if (fileNameExt.toLowerCase() === "xml") {
                        if (_resVu) {
                            //Alert no se metio porque ya hay un xml en la tabla
                            M.toast({ html: "UUID existente en BD" });
                            document.getElementById('file_sopAnexar').value = '';
                        }
                        else {
                            if (_bcorrecto) {
                                if (!_bemisor & !_breceptor) {
                                    //Alert no se metio porque ya hay un xml en la tabla
                                    M.toast({ html: "El RFC de Receptor y Emisor no coinciden" });
                                    document.getElementById('file_sopAnexar').value = '';
                                } else {
                                    if (_bemisor) {
                                        if (_breceptor) {
                                            _tab.row.add(
                                                $(tdata)
                                            ).draw(false).node();
                                        }
                                        else {
                                            //Alert no se metio porque ya hay un xml en la tabla
                                            M.toast({ html: "El RFC de Receptor no coincide" });
                                            document.getElementById('file_sopAnexar').value = '';
                                        }

                                    } else {
                                        //Alert no se metio porque ya hay un xml en la tabla
                                        M.toast({ html: "El RFC de Emisor no coincide" });
                                        document.getElementById('file_sopAnexar').value = '';
                                    }
                                }
                            } else {
                                //Alert no se metio porque ya hay un xml en la tabla
                                M.toast({ html: "El XML no tiene formato correcto" });
                                document.getElementById('file_sopAnexar').value = '';
                            }
                        }
                    }
                    else {
                        _tab.row.add(
                            $(tdata)
                        ).draw(false).node();
                    }
                } else {
                    var file = $(this).get(0).files[i];
                    var fileName = file.name;
                    var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
                    var _ban = false;
                    //Lejgg 22-10-2018------------------------------------------------>
                    $("#table_anexa > tbody  > tr[role='row']").each(function () {
                        var t = $("#table_anexa").DataTable();
                        //Obtener el row para el plugin
                        var tr = $(this);
                        var indexopc = t.row(tr).index();

                        //Obtener valores visibles en la tabla
                        var _tipoAr = $(this).find("td.TYPE").text();
                        if (fileNameExt.toLowerCase() === _tipoAr) {
                            _ban = true;
                        }
                        if (_ban)
                            return;
                    });
                    //Si el archivo es xml entra
                    //LEJGG23/10/18---------------------------------------------------->
                    if (fileNameExt.toLowerCase() === "xml") {
                        var _fbool = false;
                        //Si ban es false, no hay ningun otro archivo xml, entonces metere el registro
                        if (!_ban) {
                            tdata = "<tr><td></td><td>" + (nr + 1) + "</td><td>OK</td><td>" + file.name + "</td><td>" + fileNameExt + "</td><td><input name=\"labels_desc\" class=\"Descripcion\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td></tr>";
                            var data = new FormData();
                            var _resVu = false;
                            data.append('file', file);
                            $.ajax({
                                type: "POST",
                                url: 'procesarXML',
                                data: data,
                                dataType: "json",
                                cache: false,
                                contentType: false,
                                processData: false,
                                success: function (data) {
                                    //FRT20112018 Para validar los RFC
                                    if (data[0] == "1") {
                                        _bcorrecto = true;
                                        _resVu = validarUuid(data[5]);
                                        if (!_resVu) {
                                            _bemisor = validarRFCEmisor(data[4]);
                                            _breceptor = validarRFCReceptor(data[3], data[7]);
                                            if (_bemisor & _breceptor) {
                                                $('#Uuid').val(data[5]);
                                                $('#FECHAD').val(data[1]);
                                                $('#FECHADO').val(data[1]);
                                                $("#FECHAD").trigger("change");
                                                data[2];//Monto Total
                                                //FRT14112018.3 Para Tipo de Cambio en XML
                                                if (data[6] !== "MXN") {
                                                    tipo = data[8];
                                                    $('#TIPO_CAMBIO').val(tipo);
                                                    $('#TIPO_CAMBIO').trigger("change");
                                                    var objSelect = document.getElementById("MONEDA_ID");
                                                    objSelect.options[1].selected = true;
                                                }
                                            }

                                        }

                                    } else {
                                        _bcorrecto = false;
                                    }
                                },
                                error: function (xhr, httpStatusMessage, customErrorMessage) {
                                    //
                                },
                                async: false
                            });
                            if (_resVu) {
                                //Alert no se metio porque ya hay un xml en la tabla
                                M.toast({ html: "UUID existente en BD" });
                                document.getElementById('file_sopAnexar').value = '';
                            }
                            else {
                                //quiere decir que es true y que el rfc coincide, por lo tanto hace el pintado de datos en la tabla
                                //FRT20112018 Para saber de donde sale el error
                                if (_bcorrecto) {
                                    if (!_bemisor & !_breceptor) {
                                        //Alert no se metio porque ya hay un xml en la tabla
                                        M.toast({ html: "El RFC de Receptor y Emisor no coinciden" });
                                        document.getElementById('file_sopAnexar').value = '';
                                    } else {
                                        if (_bemisor) {
                                            if (_breceptor) {
                                                _tab.row.add(
                                                    $(tdata)
                                                ).draw(false).node();
                                            }
                                            else {
                                                //Alert no se metio porque ya hay un xml en la tabla
                                                M.toast({ html: "El RFC de Receptor no coincide" });
                                                document.getElementById('file_sopAnexar').value = '';
                                            }

                                        } else {
                                            //Alert no se metio porque ya hay un xml en la tabla
                                            M.toast({ html: "El RFC de Emisor no coincide" });
                                            document.getElementById('file_sopAnexar').value = '';
                                        }
                                    }
                                } else {
                                    //Alert no se metio porque ya hay un xml en la tabla
                                    M.toast({ html: "El XML no tiene formato correcto" });
                                    document.getElementById('file_sopAnexar').value = '';
                                }
                            }
                        }
                        else {
                            //Alert no se metio porque ya hay un xml en la tabla
                            M.toast({ html: "Ya existe una factura" });
                            document.getElementById('file_sopAnexar').value = '';
                            
                        }
                    }
                    //LEJGG23/10/18----------------------------------------------------<
                    else {
                        tdata = "<tr><td></td><td>" + (nr + 1) + "</td><td>OK</td><td>" + file.name + "</td><td>" + fileNameExt + "</td><td><input name=\"labels_desc\" class=\"Descripcion\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td></tr>";
                        _tab.row.add(
                            $(tdata)
                        ).draw(false).node();
                    }
                    //Lejgg 22-10-2018------------------------------------------------>
                }
            }
        }
        if (jsval[0].ID === "SRE") {
            var _length = $(this).get(0).files.length;
            var _tab2 = $('#table_anexa').DataTable();
            for (var i = 0; i < _length; i++) {
                var nr = _tab2.rows().count();
                if (nr === 0) {
                    var file = $(this).get(0).files[i];
                    var fileName = file.name;
                    var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
                    var nr = _tab2.rows().count();
                    var file = $(this).get(0).files[i];
                    var _data = new FormData();
                    _data.append('file', file);
                    if (fileNameExt.toLowerCase() === "xml") {
                        //Se saca el UUID
                        $.ajax({
                            type: "POST",
                            url: 'procesarXML',
                            data: _data,
                            dataType: "json",
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data !== null || data !== "") {
                                    //data[4];//UUID
                                    _resVu = validarUuid(data[4]);
                                    if (!_resVu) {
                                        //$('#Uuid').val(data[4]);
                                        //$('#FECHAD').val(data[0]);
                                        //$('#FECHADO').val(data[0]);
                                        //$("#FECHAD").trigger("change");
                                        //data[1];//Monto Total
                                        _fbool = validarRFC(data[3], data[2], data[6]);
                                        if (_fbool) {
                                            $('#Uuid').val(data[4]);
                                            $('#FECHAD').val(data[0]);
                                            $('#FECHADO').val(data[0]);
                                            $("#FECHAD").trigger("change");
                                            data[1];//Monto Total
                                        }
                                        //data[2];//RFC
                                    }
                                }
                            },
                            error: function (xhr, httpStatusMessage, customErrorMessage) {
                                //
                            },
                            async: false
                        });
                    }
                }
            }
        }
    });

    //Cadena de autorización
    //MGC 02-10-2018
    $('#list_detaa').change(function () {

        var val3 = $(this).val();
        val3 = "[" + val3 + "]";
        val3 = val3.replace("{", "{ \"");
        val3 = val3.replace("}", "\" }");
        val3 = val3.replace(/\,/g, "\" , \"");
        val3 = val3.replace(/\=/g, "\" : \"");
        val3 = val3.replace(/\ /g, "");
        var jsval = $.parseJSON(val3);

        //MGC 14-11-2018 Cadena de autorización----------------------------------------------------------------------------->
        //Obtener los datos de la cadena
        var version = "";
        var usuarioc = "";
        var id_ruta = "";
        var usuarioa = "";
        //MGC 14-11-2018 Cadena de autorización-----------------------------------------------------------------------------<

        $.each(jsval, function (i, dataj) {
            $("#DETTA_VERSION").val(dataj.VERSION);
            $("#DETTA_USUARIOC_ID").val(dataj.USUARIOC_ID);
            $("#DETTA_ID_RUTA_AGENTE").val(dataj.ID_RUTA_AGENTE);
            $("#DETTA_USUARIOA_ID").val(dataj.USUARIOA_ID);

            //MGC 14-11-2018 Cadena de autorización----------------------------------------------------------------------------->
            //Obtener los datos de la cadena
            version = dataj.VERSION;
            usuarioc = dataj.USUARIOC_ID;
            id_ruta = dataj.ID_RUTA_AGENTE;
            usuarioa = dataj.USUARIOA_ID;
            //MGC 14-11-2018 Cadena de autorización-----------------------------------------------------------------------------<

        });


        //MGC 14-11-2018 Cadena de autorización----------------------------------------------------------------------------->
        //Obtener el monto
        var monto = $('#MONTO_DOC_MD').val();
        //Obtener la sociedad
        var sociedad = $('#SOCIEDAD_ID').val();

        //Al seleccionar un solicitante, obtener la cadena para mostrar

        obtenerCadena(version, usuarioc, id_ruta, usuarioa, monto, sociedad);

        //MGC 14-11-2018 Cadena de autorización-----------------------------------------------------------------------------<

    });

    //lejgg 15-10-2018
    $('#FECHAD').change(function () {
        var fechad = $('#FECHAD').val();
        $('#FECHACON').val(fechad);
        $('#FECHA_BASE').val(fechad);
    });

});

//Cuando se termina de cargar la página
$(window).on('load', function () {

    //Formato a fechas
    try {
        var fechab = $('#FECHA_BASE').val();
        fechabs = fechab.split(" ");

        $('#FECHA_BASE').val(fechabs[0]);
    } catch (error) {
        $('#FECHA_BASE').val("");
    }

    try {
        var fechac = $('#FECHACON').val();
        fechacs = fechac.split(" ");

        $('#FECHACON').val(fechacs[0]);
    } catch (error) {
        $('#FECHACON').val("");
    }

    try {
        var fechad = $('#FECHAD').val();
        fechads = fechad.split(" ");

        $('#FECHAD').val(fechads[0]);
    } catch (error) {
        $('#FECHAD').val("");
    }

    //MGC 02-10-2018 Cadena de autorización
    //Obtener los datos de la cadena seleccionada
    $("#list_detaa").change();

    //Ocultar los campos o no dependiendo de la configuración de la solicitud
    //MGC 03-10-2018 solicitud con orden de compra
    //Si load = "load" solo se ocultan o muestran campos
    $("#tsol").trigger("change", ["load"]);
});

$('body').on('click', '#table_info tbody td.select_row', function () {
    var t = $('#table_info').DataTable();
    var tr = $(this).closest('tr');

    var indexopc = t.row(tr).index();

    //Obtener la accion
    var ac = t.row(indexopc).data()[2];

    if (ac != "H") {
        $(tr).toggleClass('selected');
    }

});

//MGC 03-10-2018 solicitud con orden de compra
$('body').on('change', '#tsol', function (event, param1) {

    var val3 = $(this).val();
    val3 = "[" + val3 + "]";
    val3 = val3.replace("{", "{ \"");
    val3 = val3.replace("}", "\" }");
    val3 = val3.replace(/\,/g, "\" , \"");
    val3 = val3.replace(/\=/g, "\" : \"");
    val3 = val3.replace(/\ /g, "");
    var jsval = $.parseJSON(val3);

    //LEJGG 22-10-2018---------------------->
    //Para pago de facturas
    //if (jsval[0].ID === "SSO") {
    //    $("#FECHAD").prop('disabled', true);
    //}
    //else {
    //    $("#FECHAD").prop('disabled', false);
    //}
    //LEJGG 22-10-2018---------------------->

    $.each(jsval, function (i, dataj) {
        $("#tsol_id2").val(dataj.ID);

        ocultarCampos(dataj.EDITDET, param1);
        mostrarTabla(dataj.EDITDET);
    });
});

//MGC 14-11-2018 Cadena de autorización----------------------------------------------------------------------------->
//Al seleccionar un solicitante, obtener la cadena para mostrar

function obtenerCadena(version, usuarioc, id_ruta, usuarioa, monto, sociedad) {

    try {
        monto = parseFloat(monto) || 0.0;
    } catch (err) {
        monto = 0.0;
    }

    //Eliminar Registros
    $("#tableAutorizadores > tbody > tr").remove();

    $.ajax({
        type: "POST",
        url: 'getCadena',
        data: { 'version': version, 'usuarioc': usuarioc, 'id_ruta': id_ruta, 'usuarioa': usuarioa, 'monto': monto, 'bukrs': sociedad },
        dataType: "json",
        success: function (data) {
            if (data !== null || data !== "") {

                $.each(data, function (i, dataj) {
                    var fase = dataj.fase;
                    var autorizador = dataj.autorizador;

                    //Agregar los valores de las cadenas a las tablas
                    $('#tableAutorizadores').append('<tr><td>' + fase + '</td><td>' + autorizador + '</td></tr>');

                }); //Fin de for


            }
        },
        error: function (xhr, httpStatusMessage, customErrorMessage) {
            M.toast({ html: httpStatusMessage });
        },
        async: false
    });

}

//eliminar registros de tabla

//MGC 14-11-2018 Cadena de autorización-----------------------------------------------------------------------------<

//LEJGG 28-10-2018
function validarUuid(uuid) {
    var ban = false;
    $.ajax({
        type: "POST",
        url: 'getUuid',
        data: { 'id': uuid },
        dataType: "json",
        success: function (data) {
            if (data !== null || data !== "") {
                if (data != "Null") {
                    //Si es diferente a null significa que si hay coincidencia
                    ban = true;
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
    return ban;
}
//MGC 03-10-2018 solicitud con orden de compra
function ocultarCampos(opc, load) {
    //respuesta en minúscula
    opc = opc.toLowerCase();

    //Si load = "load" solo se ocultan o muestran campos

    if (opc == "true") {

        //Solicitud sin orden de compra
        $("#div_norden_compra").css("display", "none");

        if (load == "load") {

        } else {
            $("#norden_compra").val("");
        }


    } else {
        //Solicitud con orden de compra
        $("#div_norden_compra").css("display", "inherit");

        if (load == "load") {

        } else {
            $("#norden_compra").val("");
        }
    }

    //Deshabilitar campos de la tabla
    ocultarColumnas(opc);
}

//FRT2011218 Para Validacion individual de RFCs
function validarRFCEmisor(rfc_pro) {
    var _rfc_pro = $('#rfc_proveedor').val();
    if (_rfc_pro.trim() === rfc_pro) {
        return true;
    }
    else {
        return false;
    }
}

function validarRFCReceptor(rfc_soc, rfc_soc_doc) {

    if (rfc_soc_doc.trim() === rfc_soc.trim()) {
        return true;
    }
    else {
        return false;
    }
}

//MGC 03-10-2018 solicitud con orden de compra
function ocultarColumnas(opc) {

    //MGC 04-10-2018 solicitud con orden de compra
    //Tabla
    var t = $('#table_info').DataTable();

    var column = t.column('CHECK:name');
    var columnindex = column.index();
    columnindex = parseInt(columnindex);

    if (opc == "true") {
        //Ocultar
        t.column(columnindex).visible(false);
    } else {
        t.column(columnindex).visible(true);
    }

}

function loadExcelSop(file) {

    var formData = new FormData();

    formData.append("FileUpload", file);
    importe_fac = 0;//jemo 25-17-2018
    var table = $('#table_sop').DataTable();
    table.clear().draw();
    $.ajax({
        type: "POST",
        url: 'LoadExcelSop',
        data: formData,
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {

            if (data !== null || data !== "") {


            }
        },
        error: function (xhr, httpStatusMessage, customErrorMessage) {
            alert("Request couldn't be processed. Please try again later. the reason        " + xhr.status + " : " + httpStatusMessage + " : " + customErrorMessage);
        },
        async: false
    });

}

//Pestaña de información

function obtenerRetenciones(flag) {
    //Obtener la sociedad
    var sociedad_id = $("#SOCIEDAD_ID").val();
    var proveedor = $("#PAYER_ID").val();//lej 05.09.2018

    //Validar que los campos tengan valores
    if ((sociedad_id != "" & sociedad_id != null) & (proveedor != "" & proveedor != null)) {
        //Enviar los valores actuales de la tabla de retenciones
        var lengthT = $("table#table_ret tbody tr[role='row']").length;
        var docsenviar = {};
        var jsonObjDocs = [];
        if (lengthT > 0) {
            //Obtener los valores de la tabla para agregarlos a la tabla oculta y agregarlos al json
            //Se tiene que jugar con los index porque las columnas (ocultas) en vista son diferentes a las del plugin

            var i = 1;
            var t = $('#table_ret').DataTable();

            $("#table_ret > tbody  > tr[role='row']").each(function () {

                //Obtener el row para el plugin
                var tr = $(this);
                var indexopc = t.row(tr).index();

                //Obtener la sociedad oculta
                var soc = t.row(indexopc).data()[0];

                //Obtener el proveedor oculto
                var prov = t.row(indexopc).data()[1];

                //Obtener valores visibles en la tabla
                var tret = toNum($(this).find("td.TRET").text());
                var indret = toNum($(this).find("td.INDRET").text());
                var bimponible = $(this).find("td.BIMPONIBLE").text();
                var imret = $(this).find("td.IMPRET").text();

                //Quitar espacios
                bimponible = bimponible.replace(/\s/g, '');
                imret = imret.replace(/\s/g, '');

                //Conversión a número
                var bimponible = toNum(bimponible);
                var imret = toNum(imret);

                var item = {};

                //Agregar los valores para enviarlos al modelo
                item["LIFNR"] = prov;
                item["BUKRS"] = soc;
                item["WITHT"] = tret;
                item["WT_WITHCD"] = indret;
                item["POS"] = i;
                item["BIMPONIBLE"] = bimponible;
                item["IMPORTE_RET"] = imret;

                jsonObjDocs.push(item);
                i++;
                item = "";
            });
        }

        //Variable para saber cuantos tipos de impuestos tiene
        tRet = [];
        tRet2 = [];
        docsenviar = JSON.stringify({ 'items': jsonObjDocs, "bukrs": sociedad_id, "lifnr": proveedor });
        var t = $('#table_ret').DataTable();
        t.rows().remove().draw(false);
        $.ajax({
            type: "POST",
            url: 'getRetenciones',
            contentType: "application/json; charset=UTF-8",
            data: docsenviar,
            success: function (data) {
                if (data !== null || data !== "") {
                    $.each(data, function (i, dataj) {
                        var bimp = toShow(dataj.BIMPONIBLE);
                        var imp = toShow(dataj.IMPORTE_RET);
                        tRet.push(dataj.WITHT);//Lej 12.09.18
                        var addedRowRet = addRowRet(t, dataj.BUKRS, dataj.LIFNR, dataj.WITHT, dataj.DESC, dataj.WT_WITHCD, bimp, imp);
                    }); //Fin de for
                }

            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                M.toast({ html: httpStatusMessage });
            },
            async: false
        });

        //Lej 12.09.18-------------------------------------------------------
        //Aqui se agregaran las columnas extras a la tabla de detalle
        //$('#table_info').DataTable().clear().draw();//Reinicio la tabla
        if (parseInt(flag) !== 99) {
            $('#table_info').DataTable().destroy();
            $('#table_info').empty();
        }
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
                "name": 'A1',//MGC 22-10-2018 Etiquetas
                "className": 'NumAnexo',
                "orderable": false,
                "width": "1px"
            },
            {
                "name": 'A2',//MGC 22-10-2018 Etiquetas
                "className": 'NumAnexo2',
                "orderable": false
            },
            {
                "name": 'A3',//MGC 22-10-2018 Etiquetas
                "className": 'NumAnexo3',
                "orderable": false
            },
            {
                "name": 'A4',//MGC 22-10-2018 Etiquetas
                "className": 'NumAnexo4',
                "orderable": false
            },
            {
                "name": 'A5',//MGC 22-10-2018 Etiquetas
                "className": 'NumAnexo5',
                "orderable": false
            },
            {
                "name": 'TEXTO',
                "className": 'TEXTO',
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
                "orderable": false,
                "visible": false//MGC 22-10-2018 Etiquetas
            },
            {
                "name": 'CONCEPTO',
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
                "orderable": false,
                "visible": false//MGC 22-10-2018 Etiquetas
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
        $("#table_info>thead>tr").append("<th class=\"lbl_pos\">Pos</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">A1</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">A2</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">A3</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">A4</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">A5</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_Texto\">Texto</th>");//FRT08112018
        $("#table_info>thead>tr").append("<th class=\"lbl_cargoAbono\">D/H</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_factura\">Factura</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_tconcepto\">TIPO CONCEPTO</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_grupo\">Concepto</th>");//FRT08112018
        $("#table_info>thead>tr").append("<th class=\"lbl_cuenta\">Cuenta</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_cuentaNom\">Nombre de cuenta</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_tipoimp\">Tipo Imp.</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_imputacion\">Imputación</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_ccosto\">Centro de Costo</th>"); //FRT08112018
        $("#table_info>thead>tr").append("<th class=\"lbl_monto\">Monto</th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_impuesto\">Impuesto  </th>");
        $("#table_info>thead>tr").append("<th class=\"lbl_iva\">IVA</th>");
        var colspan = 20;
        tRet2 = tRet;
        for (i = 0; i < tRet.length; i++) {//Revisare las retenciones que tienes ligadas
            $.ajax({
                type: "POST",
                url: 'getRetLigadas',
                data: { 'id': tRet[i] },
                dataType: "json",
                success: function (data) {
                    if (data !== null || data !== "") {
                        if (data != "Null") {
                            tRet2 = jQuery.grep(tRet2, function (value) {
                                return value != data;
                            });
                        }
                        else {
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
        //$("#table_info>tfoot>tr").append("<th colspan=\"" + colspan + "\" style=\"text-align:right\"></th>");FRT22112018 para quitar el footer
        //$("#table_info>tfoot>tr").append("<th id=\"total_info\"></th>");FRT22112018 para quitar el footer
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

        //MGC ADD 03-10-2018 solicitud con orden de compra
        arrCols.push({
            "name": 'CHECK',
            "className": 'CHECK',
            "orderable": false,
            "visible": false//MGC 22-10-2018 Etiquetas
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

        tamanosRenglones();
        //MGC 22-10-2018 Etiquetas------------------------------------------>
        //Columna tipo de concepto y columna tipo imputación ocultarlas

        //MGC 22-10-2018 Etiquetas------------------------------------------<
        //Lej 12.09.18-------------------------------------------------------
    } else {
        //Enviar mensaje de error true
    }
}

function addRowRet(t, SOCIEDAD, PROVEEDOR, TRET, DESCRET, INDRET, BIMPONIBLE, IMPRET) {

    var r = addRowret(
        t,
        SOCIEDAD,
        PROVEEDOR,
        TRET,
        DESCRET,
        INDRET,//lej 10.09.2018
        //"<input class=\"BIMPONIBLE valmon\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + BIMPONIBLE + "\">",
        BIMPONIBLE,
        //"<input class=\"IMPRET valmon\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + IMPRET + "\">"
        IMPRET//lej 10.09.2018
    );

    return r;
}

function addRowret(t, sociedad, proveedor, tret, descret, indret, bimponible, impret) {

    var r = t.row.add([
        sociedad,
        proveedor,
        tret,
        descret,
        indret,
        bimponible,
        impret
    ]).draw(false).node();

    return r;
}


//Pestaña contabilidad
function getConceptoC(con, tipo, bukrs, message) {
    conceptoValC = "";
    var localval = "";
    if (con != "") {
        $.ajax({
            type: "POST",
            url: 'getConcepto',
            dataType: "json",
            data: { "id": con, "tipo": tipo, "bukrs": bukrs },

            success: function (data) {

                if (data !== null || data !== "") {
                    asignarValConC(data);
                }

            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                if (message == "X") {
                    M.toast({ html: "Valor no encontrado" });
                }
            },
            async: false
        });
    }

    localval = conceptoValC;
    return localval;
}

function asignarValConC(val) {
    conceptoValC = val;
}

function getProveedorC(prov, message, soc) {//MGC 19-10-2018 Condiciones
    proveedorValC = "";
    var localval = "";
    if (prov != "") {
        $.ajax({
            type: "POST",
            url: 'getProveedorD',
            dataType: "json",
            data: { "lifnr": prov, "soc": soc },//MGC 19-10-2018 Condiciones

            success: function (data) {

                if (data !== null || data !== "") {
                    asignarValProvC(data);
                }

            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                if (message == "X") {
                    M.toast({ html: "Valor no encontrado" });
                }
            },
            async: false
        });
    }

    localval = proveedorValC;
    return localval;
}

function asignarValProvC(val) {
    proveedorValC = val;
}


$('body').on('change', '.IMPUESTO_SELECT', function (event, param1) {

    if (param1 != "tr") {
        //Modificación del sub, iva y total

        var t = $('#table_info').DataTable();
        var tr = $(this).closest('tr'); //Obtener el row 

        //Obtener el valor del impuesto
        var imp = tr.find("td.IMPUESTO input").val();

        //Calcular impuesto y subtotal
        var impimp = impuestoVal(imp);
        impimp = parseFloat(impimp);
        var colTotal = sumarColumnasExtras(tr);//lej 19.08.18

        var sub = tr.find("td.MONTO input").val().replace('$', '').replace(',', '');
        while (sub.indexOf(',') > -1) {
            sub = sub.replace('$', '').replace(',', '');
        }
        sub = parseFloat(sub);

        //rimpimp = 100 - impimp;//lej 19.08.18

        var impv = (sub * impimp) / 100;
        impv = parseFloat(impv);
        var total = sub + impv;
        total = parseFloat(total);

        impv = toShow(impv);
        sub = toShow(sub);
        total = toShow(total);

        //Enviar los valores a la tabla
        //Subtotal
        tr.find("td.MONTO input").val();
        tr.find("td.MONTO input").val(sub);

        //IVA
        tr.find("td.IVA input").val();
        tr.find("td.IVA input").val(impv);

        //Total
        tr.find("td.TOTAL input").val();
        if (colTotal > 0) {
            var sumt = parseFloat(total.replace('$', '').replace(',', '')) - parseFloat(colTotal);
            tr.find("td.TOTAL input").val(toShow(sumt));
        }
        else {
            tr.find("td.TOTAL input").val(total);
        }
        updateFooter();
    }

});
//MGC 04092018 Conceptos
$('body').on('focusout', '.OPER', function (e) {

    var t = $('#table_info').DataTable();
    var tr = $(this).closest('tr'); //Obtener el row 

    //Obtener el valor del impuesto
    var imp = tr.find("td.IMPUESTO input").val();

    //Calcular impuesto y subtotal
    var impimp = impuestoVal(imp);
    impimp = parseFloat(impimp);

    //Desde el total
    if ($(this).hasClass("TOTAL")) {

        var total = $(this).val();
        total = parseFloat(total);

        var impv = (total * impimp) / 100;
        impv = parseFloat(impv);
        var sub = total - impv;

        impv = toShow(impv);
        sub = toShow(sub);
        total = toShow(total);

        //Enviar los valores a la tabla
        //Subtotal
        tr.find("td.MONTO input").val();
        tr.find("td.MONTO input").val(sub);

        //IVA
        tr.find("td.IVA input").val();
        tr.find("td.IVA input").val(impv);

        //Total
        tr.find("td.TOTAL input").val();
        tr.find("td.TOTAL input").val(total);


    }
    else if ($(this).hasClass("MONTO")) {

        //Desde el subtotal
        var sub = $(this).val().replace('$', '').replace(',', '');
        //While para que elimine las comas //LEJGG20-11-2018
        while (sub.indexOf(',') > -1) {
            sub = sub.replace('$', '').replace(',', '');
        }
        sub = parseFloat(sub);

        //Lleno los campos de Base Imponible con el valor del monto
        for (x = 0; x < tRet2.length; x++) {
            var _xvalue = tr.find("td.BaseImp" + tRet2[x] + " input").val().replace('$', '').replace(',', '');
            // if (_xvalue === "") {
            //AJAX
            var indret = 0;
            $("#table_ret > tbody  > tr[role='row']").each(function () {
                var t_ret = $(this).find("td.TRET").text();
                if (t_ret === tRet2[x]) {
                    indret = $(this).find("td.INDRET").text();
                }
            });
            var campo = "";
            $.ajax({
                type: "POST",
                url: 'getCampoMult',
                dataType: "json",
                data: { 'witht': tRet2[x], 'ir': indret },
                success: function (data) {
                    if (data !== null || data !== "") {
                        campo = data;
                    }
                },
                error: function (xhr, httpStatusMessage, customErrorMessage) {
                    M.toast({ html: httpStatusMessage });
                },
                async: false
            });
            if (campo == "MONTO") {
                tr.find("td.BaseImp" + tRet2[x] + " input").val(toShow(sub));
                //Ejecutamos un ajax para llenar el valor de importe de retencion
                var _res = porcentajeImpRet(tRet2[x]);
                _res = (sub * _res) / 100;//Saco el porcentaje
                tr.find("td.ImpRet" + tRet2[x] + " input").val(toShow(_res));
            }
            if (campo == "IVA") {
                var xiva = (sub * impimp) / 100;
                var _iva_ = parseFloat(xiva);
                tr.find("td.BaseImp" + tRet2[x] + " input").val(toShow(_iva_));
                var _resx = porcentajeImpRet(tRet2[x]);
                var _resIva = _iva_ * _resx;
                //Ejecutamos un ajax para llenar el valor de importe de retencion
                tr.find("td.ImpRet" + tRet2[x] + " input").val(toShow(_resIva));
            }
            //}
        }
        //Ejecutamos el metodo para sumarizar las columnas
        var colTotal = sumarColumnasExtras(tr);

        // rimpimp = 100 - impimp;

        var impv = (sub * impimp) / 100;
        impv = parseFloat(impv);
        var total = sub + impv;
        total = parseFloat(total);

        var sub = total - impv;

        impv = toShow(impv);
        sub = toShow(sub);
        total = toShow(total);

        //Enviar los valores a la tabla
        //Subtotal
        tr.find("td.MONTO input").val();
        tr.find("td.MONTO input").val(sub);

        //IVA
        tr.find("td.IVA input").val();
        tr.find("td.IVA input").val(impv);

        //Total
        tr.find("td.TOTAL input").val();
        if (colTotal > 0) {
            var sumt = parseFloat(total.replace('$', '').replace(',', '')) - parseFloat(colTotal);
            tr.find("td.TOTAL input").val(toShow(sumt));
        }
        else {
            tr.find("td.TOTAL input").val(total);
        }
    }
    updateFooter();
    llenarRetencionesIRet();
    llenarRetencionesBImp();
    //$(".extrasC").trigger("focusout"); //lej18102018
});

function sumarColumnasExtras(tr) {
    //Las columnsas a sumarizar
    //Lej 19.09.18
    //Aqui se guardara la suma de las columnas añadidas
    var sumColAn = 0;
    for (x = 0; x < tRet2.length; x++) {
        //var x1 = tr.find("td.BaseImpF" + (x + 1) + " input.BaseImp" + x).val().replace("$", "").replace(",", "");
        //if (x1 != "") {
        //    x1 = parseFloat(x1);
        //} else {
        //    x1 = parseFloat("0");
        //}
        var x2 = tr.find("td.ImpRet" + tRet2[x] + " input").val().replace("$", "").replace(",", "");
        if (x2 != "") {
            x2 = parseFloat(x2);
        } else {
            x2 = parseFloat("0");
        }
        //sumColAn = x1 + parseFloat(sumColAn);
        sumColAn = x2 + parseFloat(sumColAn);
    }
    return sumColAn;
}
//MGC 04092018 Conceptos
function addSelectImpuesto(addedRowInfo, imp, idselect, disabled, clase) {

    //Obtener la celda del row agregado
    var ar = $(addedRowInfo).find("td.IMPUESTO");


    var sel = $("<select class = \"IMPUESTO_SELECT\" id = \"" + idselect + "\"> ").appendTo(ar);
    $("#IMPUESTO option").each(function () {
        var _valor = $(this).val();//lej 19.09.2018
        var _texto = $(this).text();//lej 19.09.2018
        sel.append($("<option>").attr('value', _valor).text(_texto));//lej 19.09.2018
    });

    //Seleccionar el valor
    //$("#" + idselect + "").val(imp).change("sel");    
    // $("#" + idselect + "").val(imp).trigger("change", ["tr"]);
    $("#" + idselect + "").val(imp);
    $("#" + idselect + "").siblings(".select-dropdown").css("font-size", "12px");
    if (disabled == "X") {

        $("#" + idselect + "").prop('disabled', 'disabled');
    }

    //Iniciar el select agregado
    var elem = document.getElementById(idselect);
    var instance = M.Select.init(elem, []);
    $(".IMPUESTO_SELECT").trigger("change");
}

//MGC 04092018 Conceptos
function verificarRowH() {
    var res = true;
    var t = $('#table_info').DataTable();
    $("#table_info > tbody > tr[role = 'row']").each(function (index) {

        //Saber si el renglón se va a sumar
        var tr = $(this);
        var indexopc = t.row(tr).index();

        //Obtener la accion
        var ac = t.row(indexopc).data()[2];

        if (ac == "H") {
            res = false;
            return false;
        }

    });

    return res;
}

//MGC 04092018 Conceptos
//Actualizar el renglón H
function updRowInfoH() {

    //Obtener los valores del encabezado
    //Obtener la cuenta del proveedor
    var prov = $('#PAYER_ID').val();

    //Obtener el tipo de impuesto
    var imp = $('#IMPUESTO').val();

    //Obtener el monto total
    var monto = $('#MONTO_DOC_MD').val();
    monto = monto.replace(/\s/g, '');
    monto = toNum(monto);
    monto = parseFloat(monto);

    //Obtener la referencia
    var factura = $('#REFERENCIA').val();

    //Obtener el nombre de la cuenta (Proveedor)
    var nprov = $('#nom_proveedor').val();

    //Obtener el tipo de doc
    var tipo_doc = "";

    //Calcular impuesto y subtotal
    var impimp = impuestoVal(imp);
    impimp = parseFloat(impimp);

    var impv = (monto * impimp) / 100;
    var sub = monto - impv;

    impv = toShow(impv);
    sub = toShow(sub);
    monto = toShow(monto);

    var t = $('#table_info').DataTable();

    $("#table_info > tbody > tr[role = 'row']").each(function (index) {

        //Saber si el renglón se va a sumar
        var tr = $(this);
        var indexopc = t.row(tr).index();

        //Obtener la accion
        var ac = t.row(indexopc).data()[2];

        if (ac == "H") {
            //Actualizar los valores
            //Actualizar la factura
            $(this).find("td.FACTURA input").val();
            $(this).find("td.FACTURA input").val(factura);

            //Actualizar el nombre de la cuenta
            $(this).find("td.CUENTANOM").text();
            $(this).find("td.CUENTANOM").text(nprov);


            //Cuenta del proveedor
            $(this).find("td.CUENTA input").text();
            $(this).find("td.CUENTA").text(prov);

            //Subtotal
            $(this).find("td.MONTO input").val();
            $(this).find("td.MONTO input").val(sub);

            //Obtener el select del tipo de impuesto
            var select = $(this).find("td.IMPUESTO div select");
            var idselect = select.attr('id');

            //Seleccionar el valor
            //$("#" + idselect + "").val(imp).change();
            $("#" + idselect + "").val(imp).trigger("change", ["tr"])
            $("#" + idselect + "").siblings(".select-dropdown").css("font-size", "12px");

            $("#" + idselect + "").prop('disabled', 'disabled');

            //Iniciar el select agregado
            var elem = document.getElementById(idselect);
            var instance = M.Select.init(elem, []);

            //IVA
            $(this).find("td.IVA input").val();
            $(this).find("td.IVA input").val(impv);

            //Total
            $(this).find("td.TOTAL input").val();
            $(this).find("td.TOTAL input").val(monto);

            return false;
        }

    });

    updateFooter();

}

//MGC 04092018 Conceptos
function addRowInfoH() {
    //--Codigolej
    //Obtener los valores del encabezado
    //Obtener la cuenta del proveedor
    var prov = $('#PAYER_ID').val();

    //Obtener el tipo de impuesto
    var imp = $('#IMPUESTO').val();

    //Obtener el monto total
    var monto = $('#MONTO_DOC_MD').val();
    monto = monto.replace(/\s/g, '');
    monto = toNum(monto);
    monto = parseFloat(monto);

    //Obtener la referencia
    var factura = $('#REFERENCIA').val();

    //Obtener el nombre de la cuenta (Proveedor)
    var nprov = $('#nom_proveedor').val();

    //Obtener el tipo de doc
    var tipo_doc = "";

    //Calcular impuesto y subtotal
    var impimp = impuestoVal(imp);
    impimp = parseFloat(impimp);

    var impv = (monto * impimp) / 100;
    var sub = monto - impv;

    impv = toShow(impv);
    sub = toShow(sub);
    monto = toShow(monto)
    var texto = "Texto prueba";//Lej 13.09.2018
    //Validar que los campos en encabezado estén completos
    if (prov != "" & prov != null & imp != "" & imp != null) {
        //Obtener la tabla
        var t = $('#table_info').DataTable();

        var addedRowInfo = addRowInfo(t, "0", "", "", "", "", "", "H", factura, "", "", prov, nprov, "", "", "", sub, tipo_doc, impv, texto, monto, "disabled");//Lej 13.09.2018
        posinfo++;

        //Obtener el select de impuestos en la cabecera
        var idselect = "infoSel" + posinfo;

        //MGC 04092018 Conceptos
        //Crear el nuevo select con los valores de impuestos
        addSelectImpuesto(addedRowInfo, imp, idselect, "X", "");
    }

    updateFooter();
}

function impuestoVal(ti) {

    var res = 0;

    if (ti != "") {
        var tsol_val = $('#impuestosval').val();
        var jsval = $.parseJSON(tsol_val);
        $.each(jsval, function (i, dataj) {
            var _i = ti.split('-');
            var _im = $.trim(_i[0]);
            if (dataj.MWSKZ == _im) {
                res = dataj.KBETR;
                return false;
            }
        });
    }

    return res;
}

function addRowInfo(t, POS, NumAnexo, NumAnexo2, NumAnexo3, NumAnexo4, NumAnexo5, CA, FACTURA, TIPO_CONCEPTO, GRUPO, CUENTA, CUENTANOM, TIPOIMP, IMPUTACION, CCOSTO, MONTO, IMPUESTO, IVA, TEXTO, TOTAL, disabled, check) { //MGC 03 - 10 - 2018 solicitud con orden de compra

    var r = addRowl(
        t,
        POS,

        "<input  class=\"NumAnexo\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo + "\">",
        "<input  class=\"NumAnexo2\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo2 + "\">",
        "<input  class=\"NumAnexo3\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo3 + "\">",
        "<input  class=\"NumAnexo4\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo4 + "\">",
        "<input  class=\"NumAnexo5\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo5 + "\">",

        //"<input class=\"CA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + CA + "\">",//MGC 04092018 Conceptos
        CA,//MGC 04092018 Conceptos
        "<input " + disabled + " class=\"FACTURA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + FACTURA + "\">",
        TIPO_CONCEPTO,
        "<input " + disabled + " class=\"GRUPO GRUPO_INPUT\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + GRUPO + "\">",
        //"<input class=\"CUENTA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + CUENTA + "\">",//MGC 04092018 Conceptos
        CUENTA,//MGC 04092018 Conceptos
        CUENTANOM,
        TIPOIMP,
        IMPUTACION,
        "<input disabled class=\"CCOSTO\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + CCOSTO + "\">",
        "<input " + disabled + " class=\"MONTO OPER\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + MONTO + "\">",
        "",
        "<input disabled class=\"IVA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + IVA + "\">",
        //"<input " + disabled + " class=\"\" style=\"font-size:12px;\"  style=\"width:150px;\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + TEXTO + "\">",//Lej 13.09.2018
        "<textarea " + disabled + " class=\"materialize-textarea\" style=\"font-size:12px;width:150px;\" maxlength=\"50\" type=\"text\" id=\"\" name=\"\" value=\"" + TEXTO + "\"> </textarea>",//Lej 13.09.2018
        TOTAL,//"<input " + disabled + " class=\"TOTAL OPER\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + TOTAL + "\">"
        check //MGC 03-10-2018 solicitud con orden de compra
    );

    return r;
}

function addRowl(t, pos, nA, nA2, nA3, nA4, nA5, ca, factura, tipo_concepto, grupo, cuenta, cuentanom, tipoimp, imputacion, ccentro, monto, impuesto,
    iva, texto, total, check) {//MGC 03-10-2018 solicitud con orden de compra
    //alert(extraCols);
    //Lej 13.09.2018---
    var colstoAdd = "";
    for (i = 0; i < extraCols; i++) {
        //if (i % 2 == 0) { 
        colstoAdd += '<td class=\"BaseImp' + tRet2[i] + '\"><input class=\"extrasC BaseImp' + i + '\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td>';
        colstoAdd += '<td class=\"ImpRet' + tRet2[i] + '\"><input class=\"extrasC2 ImpRet' + i + '\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td>';
        //}
        //else
        //{
        //}
    }
    colstoAdd += "<td><input disabled class=\"TOTAL OPER\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + total + "\"></td>"
        //+ "<td><input class=\"CHECK\" style=\"font-size:12px;\" type=\"checkbox\" id=\"\" name=\"\" value=\"" + check + "\"></td>" //MGC 03 - 10 - 2018 solicitud con orden de compra
        + "<td><p><label><input type=\"checkbox\" checked=\"" + check + "\" /><span></span></label></p></td>";//MGC 03 - 10 - 2018 solicitud con orden de compra
    var table_rows = '<tr><td></td><td>' + pos + '</td><td><input class=\"NumAnexo\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo2\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo3\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo4\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo5\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td>' +
        '<td> ' + texto + '</td><td>' + ca + '</td><td>' + factura + '</td><td>' + tipo_concepto
        + '</td><td>' + grupo + '</td><td>' + cuenta + '</td><td>' + cuentanom + '</td><td>' + tipoimp + '</td><td>' + imputacion
        + '</td><td>' + ccentro + '</td><td>' + monto + '</td><td>' + impuesto + '</td><td>' + iva + '</td>' + colstoAdd + '</tr>';
    //Lej 13.09.2018--------------------------------
    if (extraCols == 0) {//Lej 13.09.2018
        var r = t.row.add([
            "",
            pos,
            nA,
            nA2,
            nA3,
            nA4,
            nA5,
            texto,
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
            "<input disabled class=\"TOTAL OPER\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + total + "\">",
            "<input class=\"CHECK\" style=\"font-size:12px;\" type=\"checkbox\" id=\"\" name=\"\" value=\"" + check + "\">" //MGC 03 - 10 - 2018 solicitud con orden de compra
        ]).draw(false).node();
    } else {
        var r = t.row.add(
            //[
            //"",
            //pos,
            //ca,
            //factura,
            //tipo_concepto,
            //grupo,
            //cuenta,
            //cuentanom,
            //tipoimp,
            //imputacion,
            //ccentro,
            //monto,
            //impuesto,
            //iva,
            //total,
            //texto
            // ]
            $(table_rows)//Lej 13.09.2018
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
    totalinicio = "";
    $('#total_info').text(toShow(totalinicio));
    $('#MONTO_DOC_MD').val(toShow(total));//Lej 18.09.2018
    $('#total_info1').text(toShow(total));//FRT22112018
}

//Pestaña soporte
function clearFile() {

    $('#file_sop').val('');
}

function addRowSopF(t, OPC, POS, RFC, FACTURA, FECHA, MONTO, IVA, TOTAL, ARCHIVO) {

    var r = addRowlS(
        t,
        OPC,
        POS,
        RFC,
        FACTURA,
        FECHA,
        MONTO,
        IVA,
        TOTAL,
        ARCHIVO
    );

    return r;
}

function addRowlS(t, opc, pos, rfc, factura, fecha, monto, iva, total, archivo) {

    var r = t.row.add([
        ,
        opc,
        pos,
        rfc,
        factura,
        fecha,
        monto,
        iva,
        total,
        archivo,
    ]).draw(false).node();

    return r;
}

function convertI(i) {
    return typeof i === 'string' ?
        i.replace(/[\$,]/g, '') * 1 :
        typeof i === 'number' ?
            i : 0;
};

function resetFooter() {
    $('#total_info').text("$0");
}

function evaluarExt(filename) {

    var exts = ['xml'];
    // split file name at dot
    var get_ext = filename.split('.');
    // reverse name to check extension
    get_ext = get_ext.reverse();
    // check file type is valid as given in 'exts' array
    if ($.inArray(get_ext[0].toLowerCase(), exts) > -1) {
        return true;
    } else {
        return false;
    }
}

$('body').on('focusout', '.extrasC', function (e) {
    //var y = parseFloat(num);
    var total = 0;
    var _t = $('#table_ret').DataTable();
    var _this = $(this);
    var tr = $(this).closest('tr'); //Obtener el row 
    //sumarizarTodoRow(_this);

    var _v2 = "";
    //Convertir a formato monetario y numerico
    var _nnm = $(this).val().replace("$", "");
    if (_nnm === "") {
        //si esta vacio le agrego un valor de 0.0
        _nnm = parseFloat("0.0");
    } else {
        _nnm = parseFloat(_nnm.replace(',', ''));
    }

    if (_nnm !== "") {
        var cl = _this.attr('class');
        var arrcl = cl.split('p');
        var _res = porcentajeImpRet(tRet2[arrcl[1]]);
        var indret = 0;
        $("#table_ret > tbody  > tr[role='row']").each(function () {
            var t_ret = $(this).find("td.TRET").text();
            if (t_ret === tRet2[arrcl[1]]) {
                indret = $(this).find("td.INDRET").text();
            }
        });
        var campo = "";
        $.ajax({
            type: "POST",
            url: 'getCampoMult',
            dataType: "json",
            data: { 'witht': tRet2[arrcl[1]], 'ir': indret },
            success: function (data) {
                if (data !== null || data !== "") {
                    campo = data;
                }
            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                M.toast({ html: httpStatusMessage });
            },
            async: false
        });
        if (campo == "MONTO") {
            _res = (_nnm * _res) / 100;//Saco el porcentaje
        }
        if (campo == "IVA") {
            _res = (_nnm * _res);//Saco el porcentaje
        }
        tr.find("td.ImpRet" + tRet2[arrcl[1]] + " input").val(toShow(_res));

        //--------------------------------------LEJ18102018---------------------->
        //hare la operacion para actualizar el total del renglon
        var _mnt = tr.find("td.MONTO input").val().replace('$', '');
        if (_mnt === "") {
            //si esta vacio le agrego un valor de 0.0
            _mnt = parseFloat("0.0");
        }
        else {
            _mnt = parseFloat(_mnt.replace(',', ''));
        }
        var _iva = tr.find("td.IVA input").val().replace('$', '');
        if (_iva === "") {
            //si esta vacio le agrego un valor de 0.0
            _iva = parseFloat("0.0");
        } else {
            _iva = parseFloat(_iva.replace(',', ''));
        }
        var _ttal = (_mnt + _iva) - sumarColumnasExtras(tr);;
        //actualizar el total
        tr.find("td.TOTAL input").val(toShow(_ttal));
        //--------------------------------------LEJ18102018----------------------<
    }
    $(this).val("$" + _nnm.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    updateFooter();
    llenarRetencionesBImp();
    llenarRetencionesIRet();
    /*$("#table_info > tbody > tr[role = 'row']").each(function (index) {
        for (x = 0; x < tRet2.length; x++) {
            var _var = "BaseImp" + x;
            _v2 = "BaseImp" + (tRet2[x]);
            if (_this.hasClass(_var)) {
                centi = x;
                break;
            }
        }
        var colex = $(this).find("td." + _v2 + " input").val().replace("$", "").replace(',', '');
        //de esta manera saco el renglon y la celad en especifico
        var er = $('#table_ret tbody tr').eq(x).find('td').eq(3).text().replace('$', '');;
        var txbi = $.trim(colex);
        var sum = parseFloat(txbi);
        // sum = parseFloat(sum + y).toFixed(2);
        total += sum;

    });
    if (centi != 9999) {
        $('#table_ret tbody tr').eq(centi).find('td').eq(3).text('$' + total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        $('#table_ret tbody tr').eq(centi + 2).find('td').eq(3).text('$' + total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }*/
});

$('body').on('focusout', '.extrasC2', function (e) {
    //var y = parseFloat(num);
    var total = 0;
    var _t = $('#table_ret').DataTable();
    var centi = 999;
    var _this = $(this);

    sumarizarTodoRow(_this);
    var _v2 = "";
    //Convertir a formato monetario y numerico
    var _nnm = $(this).val().replace("$", "");
    if (_nnm === "") {
        //si esta vacio le agrego un valor de 0.0
        _nnm = parseFloat("0.0");
    } else {
        _nnm = parseFloat(_nnm.replace(',', ''));
    }
    $(this).val("$" + _nnm.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $("#table_info > tbody > tr[role = 'row']").each(function (index) {
        for (x = 0; x < tRet2.length; x++) {
            var _var = "ImpRet" + x;
            _v2 = "ImpRet" + tRet2[x];
            if (_this.hasClass(_var)) {
                centi = x;
                break;
            }
        }
        var colex = $(this).find("td." + _v2 + " input").val().replace("$", "").replace(',', '');
        //de esta manera saco el renglon y la celad en especifico
        var er = $('#table_ret tbody tr').eq(x).find('td').eq(3).text().replace('$', '');;
        var txbi = $.trim(colex);
        var sum = parseFloat(txbi);
        // sum = parseFloat(sum + y).toFixed(2);
        total += sum;

    });
    if (centi != 9999) {
        $('#table_ret tbody tr').eq(centi).find('td').eq(4).text('$' + total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        $('#table_ret tbody tr').eq(centi + 2).find('td').eq(4).text('$' + total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }
});


function sumarizarTodoRow(_this) {
    //Inicio codio sumarizar
    //Ejecutamos el metodo para sumarizar las columnas
    //var t = $('#table_info').DataTable();
    var tr = _this.closest('tr'); //Obtener el row 
    //Obtener el valor del impuesto
    var imp = tr.find("td.IMPUESTO input").val();
    //Calcular impuesto y subtotal
    var impimp = impuestoVal(imp);
    impimp = parseFloat(impimp);
    var colTotal = sumarColumnasExtras(tr);

    //Desde el subtotal
    var sub = tr.find("td.MONTO input").val().replace('$', '').replace(',', '');
    sub = parseFloat(sub);

    //rimpimp = 100 - impimp;

    var impv = (sub * impimp) / 100;
    impv = parseFloat(impv);

    var total = sub + impv;
    total = parseFloat(total);
    var sub = total - impv;

    impv = toShow(impv);
    sub = toShow(sub);
    total = toShow(total);

    //Enviar los valores a la tabla
    //Subtotal
    tr.find("td.MONTO input").val();
    tr.find("td.MONTO input").val(sub);

    //IVA
    tr.find("td.IVA input").val();
    tr.find("td.IVA input").val(impv);

    //Total
    tr.find("td.TOTAL input").val();
    if (colTotal > 0) {
        var sumt = parseFloat(total.replace('$', '').replace(',', '')) - parseFloat(colTotal);
        tr.find("td.TOTAL input").val(toShow(sumt));
    }
    else {
        tr.find("td.TOTAL input").val(total);
    }
    //Fin de codigo que sumariza
    updateFooter();
}

function porcentajeImpRet(val) {
    var res = 0;
    var indret = 0;
    $("#table_ret > tbody  > tr[role='row']").each(function () {
        var t_ret = $(this).find("td.TRET").text();
        if (t_ret === val) {
            indret = $(this).find("td.INDRET").text();
        }
    });

    $.ajax({
        type: "POST",
        url: 'getPercentage',
        dataType: "json",
        data: { 'witht': val, 'ir': indret },
        success: function (data) {
            if (data !== null || data !== "") {
                res = data;
            }
        },
        error: function (xhr, httpStatusMessage, customErrorMessage) {
            M.toast({ html: httpStatusMessage });
        },
        async: false
    });
    return res;
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
            url: 'getPartialRet',
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
            var inpt = t.row(indexopc).data()[10];
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
            var cuenta = t.row(indexopc).data()[12];

            //Obtener la imputación
            //var imputacion = t.row(indexopc).data()[14];
            var imputacion = t.row(indexopc).data()[15];//linea 271 de acuerdo a createa.js

            //MGC 22-10-2018 Modificación en etiquetas
            //Obtener el nombre de la cuenta
            var cuentanom = t.row(indexopc).data()[13];

            //MGC 11-10-2018 Obtener valor de columnas ocultas <---------------------------
            //Lej 14.08.2018-------------------------------------------------------------I
            var colsAdded = tRet2.length;//Las retenciones que se agregaron a la tabla
            var retTot = tRet.length;//Todas las retenciones
            //Lej 14.08.2018-------------------------------------------------------------T
            var pos = toNum($(this).find("td.POS").text());
            // var ca = $(this).find("td.CA").text(); //MGC 04092018 Conceptos
            var ca = t.row(indexopc).data()[8];//lejgg 09-10-2018 Conceptos
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
            //var tipoimp = t.row(indexopc).data()[13];//MGC 22-10-2018 Modificación en etiquetas
            //var tipoimp = t.row(indexopc).data()[14];//LEJGG 15-11-2018 Modificación en etiquetas
            var tipoimp = t.row(indexopc).data()[14];//LEJGG 15-11-2018 Modificación en etiquetas

            //var imputacion = $(this).find("td.IMPUTACION").text(); //MGC 11-10-2018 Obtener valor de columnas oculta
            var ccosto = $(this).find("td.CCOSTO input").val(); //MGC 11-10-2018 Obtener valor de columnas oculta
            var impuesto = $(this).find("td.IMPUESTO input").val();
            var monto1 = $(this).find("td.MONTO input").val().replace(',', '');
            while (monto1.indexOf(',') > -1) {
                monto1 = monto1.replace('$', '').replace(',', '');
            }
            monto1 = monto1.replace(/\s/g, '');
            var monto = toNum(monto1);
            var iva1 = $(this).find("td.IVA input").val().replace(',', '');
            while (iva1.indexOf(',') > -1) {
                iva1 = iva1.replace('$', '').replace(',', '');
            }
            iva1 = iva1.replace(/\s/g, '');
            var iva = toNum(iva1);
            var total1 = $(this).find("td.TOTAL input").val().replace(',', '');
            while (total1.indexOf(',') > -1) {
                total1 = total1.replace('$', '').replace(',', '');
            }
            //var texto = $(this).find("td.TEXTO input").val();//LEJ 14.09.2018
            var texto = $(this).find("td.TEXTO textarea").val();//LEJGG 13.11.2018
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
                var b1 = $(this).find("td.BaseImp" + tRet2[j] + " input").val().replace('$', '').replace(',', '');
                b1 = b1.replace(/\s/g, '');
                var _bi = toNum(b1);
                item2["BIMPONIBLE"] = parseFloat(_bi);
                var b2 = $(this).find("td.ImpRet" + tRet2[j] + " input").val().replace('$', '').replace(',', '');
                b2 = b2.replace(/\s/g, '');
                var _iret = toNum(b2);
                item2["IMPORTE_RET"] = parseFloat(_iret);
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
            url: 'getPartialCon',
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
            url: 'getPartialCon2',
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
            url: 'getPartialCon3',
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

//FRT 12112018 pARA PODER LLENAR LOS VALORES DE LA TABLA QUE SE ELIMINO
function copiarTableAnexos() {

    var lengthT = $("table#table_anexa tbody tr[role='row']").length;
    var docsenviar = {};
    if (lengthT > 0) {

        jsonObjDocs = [];
        var i = 1;
        var t = $('#table_anexa').DataTable();


        $("#table_anexa > tbody  > tr[role='row']").each(function () {
            //Obtener el row para el plugin
            var tr = $(this);
            var indexopc = t.row(tr).index();


            var name = $(this).find("td.NAME").text();
            var tipo = $(this).find("td.TYPE").text();
            var desc = "";
            var path = "";

            var item = {};

            item["NAME"] = name;
            item["TIPO"] = tipo;
            item["DESC"] = desc;
            item["PATH"] = path;

            jsonObjDocs.push(item);
            i++;
            item = "";

        });

        docsenviar = JSON.stringify({ 'docs': jsonObjDocs });

        $.ajax({
            type: "POST",
            url: 'getPartialCon41',
            contentType: "application/json; charset=UTF-8",
            data: docsenviar,
            success: function (data) {

                if (data !== null || data !== "") {

                    $("table#table_anexa tbody").append(data);
                }

            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                M.toast({ html: httpStatusMessage });
            },
            async: false
        });
    }

}

//END FRT 12112018
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


            //var costo_unitario = toNum($(this).find("td:eq(" + (8 + indext) + ") input").val());//RSG 09.07.2018
            //var porc_apoyo = toNum($(this).find("td:eq(" + (9 + indext) + ") input").val());
            //var monto_apoyo = toNum($(this).find("td:eq(" + (10 + indext) + ") input").val());

            //var precio_sug = toNum($(this).find("td:eq(" + (12 + indext) + ") input").val());
            //var volumen_est = toNum($(this).find("td:eq(" + (13 + indext) + ") input").val());

            //var total = toNum($(this).find("td:eq(" + (14 + indext) + ") input").val());

            //var item = {};

            //item["NUM_DOC"] = 0;
            //item["POS"] = i;
            //item["VIGENCIA_DE"] = vigencia_de + " 12:00:00 p.m.";
            //item["VIGENCIA_AL"] = vigencia_al + " 12:00:00 p.m.";
            //item["MATNR"] = matnr || "";
            //item["MATKL"] = matkl;
            //item["MATKL_ID"] = matkl_id;
            //item["CANTIDAD"] = 0; //Siempre 0
            //item["MONTO"] = costo_unitario;
            //item["PORC_APOYO"] = porc_apoyo;
            //item["MONTO_APOYO"] = monto_apoyo;
            //item["PRECIO_SUG"] = precio_sug;
            //volumen_est = volumen_est || 0
            //total = parseFloat(total);
            //if (vol == "estimado") {
            //    item["VOLUMEN_EST"] = volumen_est;
            //    item["VOLUMEN_REAL"] = 0;
            //    item["APOYO_REAL"] = 0;
            //    item["APOYO_EST"] = total;
            //} else {
            //    item["VOLUMEN_EST"] = 0;
            //    item["VOLUMEN_REAL"] = volumen_est;
            //    item["APOYO_REAL"] = total;
            //    item["APOYO_EST"] = 0;

            //}

            //jsonObjDocs.push(item);
            //i++;
            //item = "";
            //if (borrador != "X") { //B20180625 MGC 2018.07.03
            //    $(this).addClass('selected');
            //}
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

//lejgg 23/10/18
function llenarRetencionesIRet() {
    var _t = [];
    var centi = 9999;
    for (x = 0; x < tRet2.length; x++) {
        _t.push("0");
    }
    $("#table_info > tbody > tr[role = 'row']").each(function (index) {
        for (x = 0; x < tRet2.length; x++) {
            var _var = "ImpRet" + x;
            _v2 = "ImpRet" + tRet2[x];
            if ($(this).find("td." + _v2 + " input").hasClass(_var)) {
                centi = x;
                var colex = $(this).find("td." + _v2 + " input").val().replace("$", "").replace(',', '');
                //de esta manera saco el renglon y la celad en especifico
                //var er = $('#table_ret tbody tr').eq(x).find('td').eq(3).text().replace('$', '');
                var txbi = $.trim(colex);
                var sum = parseFloat(txbi);
                _t[x] = parseFloat(_t[x]) + sum;
                //break;
            }
        }
        /* var colex = $(this).find("td." + _v2 + " input").val().replace("$", "").replace(',', '');
         //de esta manera saco el renglon y la celad en especifico
         //var er = $('#table_ret tbody tr').eq(x).find('td').eq(3).text().replace('$', '');
         var txbi = $.trim(colex);
         var sum = parseFloat(txbi);
         // sum = parseFloat(sum + y).toFixed(2);
         _t += sum;*/
    });
    for (x = 0; x < tRet2.length; x++) {
        $('#table_ret tbody tr').eq(x).find('td').eq(4).text('$' + parseFloat(_t[x]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }
    //$('#table_ret tbody tr').eq(0).find('td').eq(4).text('$' + _t[].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    // $('#table_ret tbody tr').eq(1).find('td').eq(4).text('$' + _t.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

}

function llenarRetencionesBImp() {
    var _t = [];
    var centi = 0;
    for (x = 0; x < tRet2.length; x++) {
        _t.push("0");
    }
    $("#table_info > tbody > tr[role = 'row']").each(function (index) {
        for (x = 0; x < tRet2.length; x++) {
            var _var = "BaseImp" + x;
            _v2 = "BaseImp" + tRet2[x];
            if ($(this).find("td." + _v2 + " input").hasClass(_var)) {
                var colex = $(this).find("td." + _v2 + " input").val().replace("$", "").replace(',', '');
                var txbi = $.trim(colex);
                var sum = parseFloat(txbi);
                _t[x] = parseFloat(_t[x]) + sum;
            }
        }
    });
    for (x = 0; x < tRet2.length; x++) {
        $('#table_ret tbody tr').eq(x).find('td').eq(3).text('$' + parseFloat(_t[x]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }

}

//lEJGG 22-10-2018
function validarFacs() {
    var _ban = false;
    $("#table_anexa > tbody  > tr[role='row']").each(function () {
        var t = $("#table_anexa").DataTable();
        //Obtener el row para el plugin
        var tr = $(this);
        var indexopc = t.row(tr).index();

        //Obtener valores visibles en la tabla
        var _tipoAr = $(this).find("td.TYPE").text();
        if ("xml" === _tipoAr) {
            _ban = true;
        }
        if (_ban)
            return;
    });
    return _ban;
}

function resetTabs() {

    var ell = document.getElementById("tabs");
    var instances = M.Tabs.getInstance(ell);

    var active = $('.tabs').find('.active').attr('href');
    active = active.replace("#", "");
    instances.select(active);
    //instances.updateTabIndicator
}

//LEJGG 13/11/2018
function tamanosRenglones() {
    //TEXTO
    var t_ret = $("#table_info>thead>tr").find('th.TEXTO');
    //var t_ret = $(this).find("th.TEXTO");
    t_ret.css("text-align", "center");
}
//Lejgg 10/10/2018
function guardarBorrador(asyncv) {
    //var _miles = $("#miles").val();
    //var _decimales = $("#dec").val();

    ////Guardar los valores de la tabla en el modelo para enviarlos al controlador
    //copiarTableInfoControl();
    ////copiarTableSopControl();
    //copiarTableRet();

    ////dar formato al monto
    //var enca_monto = $("#MONTO_DOC_MD").val();
    //enca_monto = enca_monto.replace(/\s/g, '');
    ////enca_monto = toNum(enca_monto);
    ////enca_monto = parseFloat(enca_monto);
    //$("#MONTO_DOC_MD").val(enca_monto);

    ////LEJ 11.09.2018
    ////dar formato al T CAMBIO
    //var tcambio = $("#TIPO_CAMBIO").val();
    //tcambio = tcambio.replace(/\s/g, '');
    //tcambio = toNum(tcambio);
    //tcambio = parseFloat(tcambio);
    //$("#TIPO_CAMBIO").val(tcambio);

    //var _b = false;
    //var _vs = [];
    //var msgerror = "";
    //var _rni = 0;
    ////Validar que los anexos existan
    //$("#table_anexa > tbody  > tr[role='row']").each(function () {
    //    var pos = $(this).find("td.POS").text();
    //    _vs.push(pos);
    //});

    //$("#table_info > tbody  > tr[role='row']").each(function () {
    //    _rni++;
    //    //Obtener valores visibles en la tabla
    //    var na1 = $(this).find("td.NumAnexo input").val();
    //    var na2 = $(this).find("td.NumAnexo2 input").val();
    //    var na3 = $(this).find("td.NumAnexo3 input").val();
    //    var na4 = $(this).find("td.NumAnexo4 input").val();
    //    var na5 = $(this).find("td.NumAnexo5 input").val();
    //    if (_vs.length > 0) {
    //        for (var i = 0; i < _vs.length; i++) {
    //            if (na1 === _vs[i] || na1 === "") {
    //                _b = true;
    //                break;
    //            } else {
    //                _b = false;
    //                msgerror = "Error en el renglon " + _rni + " valor: " + na1 + " Columna 2";
    //            }
    //        }
    //        if (_b === false) {
    //            return false;
    //        }
    //        for (var i2 = 0; i2 < _vs.length; i2++) {
    //            if (na2 === _vs[i2] || na2 === "") {
    //                _b = true;
    //                break;
    //            } else {
    //                _b = false;
    //                msgerror = "Error en el renglon " + _rni + " valor: " + na2 + " Columna 3";
    //            }
    //        }
    //        if (_b === false) {
    //            return false;
    //        }
    //        for (var i3 = 0; i3 < _vs.length; i3++) {
    //            if (na3 === _vs[i3] || na3 === "") {
    //                _b = true;
    //                break;
    //            } else {
    //                _b = false;
    //                msgerror = "Error en el renglon " + _rni + " valor: " + na3 + " Columna 4";
    //            }
    //        }
    //        if (_b === false) {
    //            return false;
    //        }
    //        for (var i4 = 0; i4 < _vs.length; i4++) {
    //            if (na4 === _vs[i4] || na4 === "") {
    //                _b = true;
    //                break;
    //            } else {
    //                _b = false;
    //                msgerror = "Error en el renglon " + _rni + " valor: " + na4 + " Columna 5";
    //            }
    //        }
    //        if (_b === false) {
    //            return false;
    //        }
    //        for (var i5 = 0; i5 < _vs.length; i5++) {
    //            if (na5 === _vs[i5] || na5 === "") {
    //                _b = true;
    //                break;
    //            } else {
    //                _b = false;
    //                msgerror = "Error en el renglon " + _rni + " valor: " + na5 + " Columna 6";
    //            }
    //        }
    //        if (_b === false) {
    //            return false;
    //        }
    //    } else {
    //        _b = true;
    //    }
    //});
    //if (_b) {
    //    //Complemento mensaje
    //    var comp = "";

    //    if (asyncv === true) {
    //        comp = "(Autoguardado)";
    //    }
    //    //Obtener los parametros para enviar
    //    var form = $("#formCreate");
    //    $.ajax({
    //        type: "POST",
    //        url: 'Borrador',
    //        dataType: "json",
    //        data: form.serialize(),
    //        success: function (data) {

    //            if (data !== null || data !== "") {
    //                //if (data === true) {
    //                    //M.toast({ html: "Borrador Guardado " + comp });
    //                   // $('#btn_borradore').css("display", "inline-block"); 
    //                //} else {
    //                //    M.toast({ html: "No se guardo el borrador" + comp });
    //                //}
    //            }

    //        },
    //        error: function (xhr, httpStatusMessage, customErrorMessage) {
    //            M.toast({ html: "No se guardo el borrador" + comp });
    //        },
    //        async: asyncv
    //    });
    //} else {
    //    M.toast({ html: msgerror });
    //}
    $("#borr").val('B');
    $('#btn_guardarh').trigger("click");
}

//FRT14112018.3 fUNCIONES PARA TENER EL TIPO DE CAMBIO
function getTipoCambio(moneda, fecha) {
    tipocambio = "";
    var localval = "";
    if (moneda != "") {
        $.ajax({
            type: "POST",
            url: 'getTipoCambio',
            dataType: "json",
            data: { "tcurr": moneda, "gdatu": fecha },//MGC 19-10-2018 Condiciones

            success: function (data) {

                if (data !== null || data !== "") {
                    asignarVal(data);
                }

            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {
                if (message == "X") {
                    M.toast({ html: "Valor no encontrado" });
                }
            },
            async: false
        });
    }

    localval = tipocambio;
    return localval;
}

function asignarVal(val) {
    tipocambio = val;
}


//END FRT14112018