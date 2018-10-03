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

            ui.item.value = val;


            selectConcepto(val, tr, tipo);
        }
    });
});

function selectProveedor(val) {

    //Add MGC Validar que los proveedores no existan duplicados en la tabla
    var prov = getProveedorC(val, "");

    $('#rfc_proveedor').val();
    $('#nom_proveedor').val();

    if (prov != null & prov != "") {
        //Asignar valores
        $('#PAYER_ID').val(prov.LIFNR);
        $('#rfc_proveedor').val(prov.STCD1);
        $('#nom_proveedor').val(prov.NAME1);
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

    //Add MGC Validar que los conceptos no existan duplicados en la tabla
    if (conExist) {
        M.toast({ html: 'Ya hay un concepto con ese mismo identificador' });
        tr.find("td.GRUPO input").val();
    } else {
        //Agregar el id
        tr.find("td.GRUPO input").val();
        tr.find("td.GRUPO input").val(val);
        //Obtener la sociedad
        var soc = $("#SOCIEDAD_ID").val();
        //Cancepto
        var con = getConceptoC(val,tipo,soc,"");

        //Asignar los valores en la tabla
        if (con != "" & con != null) {
            //Cuenta
            tr.find("td.CUENTA").text(con.CUENTA);

            //Nombre de la cuenta
            tr.find("td.CUENTANOM").text(con.DESC_CONCEPTO);

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
                var PEP = "RE-00900-I" + soc + "" + tipo + "-" + p0 +"-"+p1;
                tr.find("td.IMPUTACION").text(PEP);

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