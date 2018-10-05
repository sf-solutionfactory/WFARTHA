$(document).ready(function () {
    var elem = document.querySelectorAll('select');
    var instance = M.Select.init(elem, []);

    //Inicializar las tabs
    $('#tabs').tabs();


    $('#btn_guardarh').on("click", function (e) {



        //Termina provisional
        $('#btn_guardar').click();
   

    });
   
});