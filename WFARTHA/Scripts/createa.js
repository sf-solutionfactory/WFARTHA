$('body').on('keydown.autocomplete', '#PAYER_ID', function () {
    var tr = $(this).closest('tr'); //Obtener el row

    //Obtener el id de la sociedad
    var soc = $("#SOCIEDAD_ID").val();

    auto(this).autocomplete({
        source: function (request, response) {
            auto.ajax({
                type: "POST",
                url: 'getProveedor',
                dataType: "json",
                data: { "Prefix": request.term, bukrs: soc },
                success: function (data) {
                    response(auto.map(data, function (item) {
               
                        //return { label: trimStart('0', item.LIFNR) + " - " + item.NAME1, value: trimStart('0', item.LIFNR) };
                        return { label: trimStart('0', item.LIFNR) + " - " + item.NAME1, value: item.LIFNR };
                    }))
                }
            })
        },
        messages: {
            noResults: '',
            results: function (resultsCount) { }
        },
        change: function (e, ui) {
            if (!(ui.item)) {
                e.target.value = "";
            }
        },
        select: function (event, ui) {

            var label = ui.item.label;
            var value = ui.item.value;
            selectProveedor(value);
        }
    });
});



$('body').on('keydown.autocomplete', '.GRUPO_INPUT', function () {
    var tr = $(this).closest('tr'); //Obtener el row

    //Obtener el id de la sociedad
    var soc = $("#SOCIEDAD_ID").val();
     
    auto(this).autocomplete({
        source: function (request, response) {
            auto.ajax({
                type: "POST",
                url: 'getConceptoI',
                dataType: "json",
                data: { "Prefix": request.term, bukrs: soc},
                success: function (data) {
                    response(auto.map(data, function (item) {
                        return { label: item.TIPO_CONCEPTO + "" + item.ID_CONCEPTO + " - " + item.DESC_CONCEPTO, value: item.TIPO_CONCEPTO+"-"+ item.ID_CONCEPTO };
                    }))
                }
            })
        },
        messages: {
            noResults: '',
            results: function (resultsCount) { }
        },
        change: function (e, ui) {
            if (!(ui.item)) {
                e.target.value = "";
            }
        },
        select: function (event, ui) {

            var label = ui.item.label;
            var value = ui.item.value;

            //Quitar espacios
            value = value.replace(/\s/g, '');

            //Obtener el despliegue de la llave
            var cadena = value.split("-");
            var tipo = cadena[0];
            var val = cadena[1];

            val = val.replace(/\s/g, '');

            ui.item.value = tipo + "" + val;//MGC 22-10-2018 Etiquetas


            selectConcepto(val, tr, tipo);
        }
    });
});

function selectProveedor(val) {

    //Obtener las sociedad//MGC 19-10-2018 Condiciones
    var soc = $("#SOCIEDAD_ID").val();//MGC 19-10-2018 Condiciones

    //Add MGC Validar que los proveedores no existan duplicados en la tabla
    var prov = getProveedorC(val, "", soc);//MGC 19-10-2018 Condiciones

    $('#rfc_proveedor').val();
    $('#nom_proveedor').val();
    $('#condiciones_prov').val();//MGC 19-10-2018.2 Condiciones

    if (prov != null & prov != "") {
        //Asignar valores
        $('#PAYER_ID').val(prov.LIFNR);
        $('#rfc_proveedor').val(prov.STCD1);
        $('#nom_proveedor').val(prov.NAME1); 
        $('#condiciones_prov').val(prov.COND_PAGO);//MGC 19-10-2018.2 Condiciones
        obtenerRetenciones(false);//LEJ 05.09.2018
    }
}

function trimStart(character, string) {
    var startIndex = 0;

    while (string[startIndex] === character) {
        startIndex++;
    }

    return string.substr(startIndex);
}

function selectConcepto(val, tr, tipo) {
    var t = $('#table_info').DataTable();

    ////Add MGC Validar que los conceptos no existan duplicados en la tabla
    var conExist = valConcepto(val, tipo);


    //Obtener el row para el plugin //MGC 11-10-2018 No enviar correos 
    var trp = $(tr);
    var indexopc = t.row(trp).index();

    //Add MGC Validar que los conceptos no existan duplicados en la tabla
    if (conExist) {
        M.toast({ html: 'Ya hay un concepto con ese mismo identificador' });
        tr.find("td.GRUPO input").val();
    } else {
        //Agregar el id
        tr.find("td.GRUPO input").val();
        tr.find("td.GRUPO input").val(tipo + "" + val);//MGC 22-10-2018 Etiquetas
        //Obtener la sociedad
        var soc = $("#SOCIEDAD_ID").val();
        //Cancepto
        var con = getConceptoC(val,tipo,soc,"");

        //Asignar los valores en la tabla
        if (con != "" & con != null) {

            //Cuenta
            t.cell(indexopc, 11).data(con.CUENTA).draw();//MGC 11-10-2018 No enviar correos 
            //tr.find("td.CUENTA").text(con.CUENTA);//MGC 11-10-2018 No enviar correos 

            //Nombre de la cuenta
            t.cell(indexopc, 12).data(con.DESC_CONCEPTO).draw();
            //tr.find("td.CUENTANOM").text(con.DESC_CONCEPTO);//MGC 11-10-2018 No enviar correos 

            //Tipo de imputación
            tr.find("td.TIPOIMP").text(con.TIPO_IMPUTACION);

            //Actualizar el tipo concepto
            var indexopc = t.row(tr).index();
            //var cell = t.row(indexopc).data()[4];
            //t.cell(indexopc, 9).data(tipo).draw();
            t.cell(indexopc, 9).data("<input class=\"\" disabled style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + tipo + "\">").draw();//LEJ 01.10.2018

            //ocultar o mostrar el centro de costo
            if (con.TIPO_IMPUTACION == "P") {
                //Armar el elemento pep
                //Obtener los guiones
                var p0 = val.substring(0, 3);
                var p1 = val.substring(3, 6);
                //var PEP = "RE-00900-I" + soc + "" + tipo + "-" + val;
                var PEP = "RE-00900-I" + soc + "" + tipo + "-" + p0 + "-" + p1;

                t.cell(indexopc, 14).data(PEP).draw();//MGC 11-10-2018 No enviar correos 
                //tr.find("td.IMPUTACION").text(PEP);//MGC 11-10-2018 No enviar correos 

                tr.find("td.CCOSTO input").prop('disabled', true);
            } else if (con.TIPO_IMPUTACION == "K") {
                tr.find("td.CCOSTO input").prop('disabled', false);
            } else {
                tr.find("td.CCOSTO input").prop('disabled', false);
            }

        } else {
            tr.find("td.GRUPO input").val();
        }
    }
}

function valConcepto(con, tipo) {

    var res = false;

    var lengthT = $("table#table_info tbody tr[role='row']").length;

    if (lengthT > 0) {

        $("#table_info > tbody  > tr[role='row']").each(function () {
            var c = "";
            c = $(this).find("td.GRUPO input").val();

            var t = "";
            t = $(this).find("td.CONCEPTO").text();

            if (con == c && tipo == t) {
                res = true;
                return false;
            }

        });

    }

    return res;
}

//MGC 19-10-2018 CECOS--------------------------------------------------->

$('body').on('keydown.autocomplete', '.CCOSTO', function () {
    var tr = $(this).closest('tr'); //Obtener el row

    //Obtener el id de la sociedad
    var soc = $("#SOCIEDAD_ID").val();

    auto(this).autocomplete({
        source: function (request, response) {
            auto.ajax({
                type: "POST",
                url: 'getCcosto',
                dataType: "json",
                data: { "Prefix": request.term, "bukrs": soc },
                success: function (data) {
                    response(auto.map(data, function (item) {

                        //return { label: trimStart('0', item.LIFNR) + " - " + item.NAME1, value: trimStart('0', item.LIFNR) };
                        return { label: trimStart('0', item.CECO1) + " - " + item.TEXT, value: item.CECO1 };
                    }))
                }
            })
        },
        messages: {
            noResults: '',
            results: function (resultsCount) { }
        },
        change: function (e, ui) {
            if (!(ui.item)) {
                e.target.value = "";
            }
        },
        select: function (event, ui) {

            var label = ui.item.label;
            var value = ui.item.value;
            selectCeco(value, tr);
        }
    });
});

function selectCeco(val, tr) {

    var t = $('#table_info').DataTable();

    //Obtener el row para el plugin //MGC 19-10-2018 
    var trp = $(tr);
    var indexopc = t.row(trp).index();     

    tr.find("td.CCOSTO input").val();
    if (val != null & val != "") {
        //Asignar número de ceco a la columna
        
        tr.find("td.CCOSTO input").val(val);

    } 
}

//MGC 19-10-2018 CECOS---------------------------------------------------<