
function initCanvas(canvasTela, canvasCores,canvasBotoes,canvasBrush, dadosTela){

    var contexto = canvasTela.getContext('2d');
    var $canvas = $(canvasTela);
    var corSelecionada = null;
    var desenhando = false; 
    var dadosDesfazer = [];
    var dadosResfazer = [];

    var tabelaCores = [
        {
            name: 'black',
            regularCode: '#222',
            opagueCode: 'rgb(189, 189, 189)',
        },
        {
            name: 'blue',
            regularCode: '#0724a8',
            opagueCode: 'rgb(75, 108, 255)',
        },
        {
            name: 'green',
            regularCode: '#5cb85c',
            opagueCode: 'rgb(206, 234, 206)',
        },
        {
            name: 'yellow',
            regularCode: '#f0ad4e',
            opagueCode: 'rgb(251, 231, 202)',
        },

        {
            name: 'pink',
            regularCode: '#f7319e',
            opagueCode: 'rgb(255, 200, 230)',
        },

        {
            name: 'purple',
            regularCode: '#7700a7',
            opagueCode: 'rgb(210, 110, 250)',
        },

        {
            name: 'red',
            regularCode: '#d41610',
            opagueCode: 'rgb(244, 203, 202)',
        },
        {
            name: 'white',
            regularCode: '#fff',
            opagueCode: '#fff',
        },
    ];

    $(canvasCores).children('li')
        .on('click', function() {
            var $this = $(this);
            var tarColorName = $this.data('color');
            corSelecionada = tabelaCores.find((item) => {
                return item.name === tarColorName;
            });
            $this.siblings('.current')
                .removeClass('current')
                .end()
                .addClass('current');
        })
        .siblings('[data-color=black]')
        .click();

        var pincel = $(canvasBrush).children('input').val();
    
        
        $(canvasBrush).children('input')
            .on('click', function() {
                pincel = $(canvasBrush).children('input').val();
                contexto.lineWidth = Number(pincel);
            });

    
    function loadDadosTela(data) {
        var img = new Image();
        img.src = data;
        img.onload = () => {
            limparCanvas();
            contexto.drawImage(img, 0, 0);
        };
    }

    function limparCanvas() {
        contexto.clearRect(0, 0, 500, 500);
    };

    function saveDadosTela() {
        var currentStatus = canvasTela.toDataURL();
        dadosDesfazer.unshift(currentStatus);
    };

    if (dadosTela !== null) {
        loadDadosTela(dadosTela);
    }

    saveDadosTela();

    $canvas.on('mousedown touchstart', (e) =>
    {
        var x;
        var y;
        switch (e.type) {
            case 'touchstart':
                x = e.touches[0].clientX - $canvas.offset().left;
                y = e.touches[0].clientY - $canvas.offset().top;
            break;
            default:
                x = e.offsetX;
                y = e.offsetY;
            break;
        }
        desenhando = true ;
        contexto.strokeStyle = corSelecionada.opagueCode;
        contexto.lineCap = 'round';
        contexto.lineJoin = 'round';
        contexto.imageSmoothingEnabled = true;
        contexto.beginPath();
        contexto.moveTo(x, y);
    })

    .on('mousemove touchmove',(e) =>{
        if(desenhando === true) {
            var x;
            var y;

            switch (e.type) {
                case 'touchmove':
                    x = e.changedTouches[0].clientX - $canvas.offset().left;
                    y = e.changedTouches[0].clientY - $canvas.offset().top;
                break;
                default:
                    x = e.offsetX;
                    y = e.offsetY;
                break;
            }
        contexto.lineTo(x, y);
        contexto.stroke();
        }
    })

    .on('mouseout mouseup touchend',function(e){
        if(desenhando === true) {
            var x;
            var y;
            switch (e.type) {
                case 'touchend':
                    x = e.changedTouches[0].clientX - $canvas.offset().left;
                    y = e.changedTouches[0].clientY - $canvas.offset().top;
                break;
                default:
                    x = e.offsetX;
                    y = e.offsetY;
                break;
            }
        contexto.strokeStyle = corSelecionada.regularCode;
        contexto.lineTo(x, y);
        contexto.stroke();
        desenhando = false;
        saveDadosTela();
        }
    });

    $(canvasBotoes)

        .children('#desfazer')
        .on('click', () => {
            if (dadosDesfazer.length !== 0) {
                loadDadosTela(dadosDesfazer[0]);
                var dadosAtual = dadosDesfazer.splice(0, 1);
                dadosResfazer.unshift(dadosAtual);
            }
        })
        .end()
        .children('#refazer')
        .on('click', () => {
            if (futureStatusStack.length !== 0) {
                loadDadosTela(dadosResfazer[0]);
                var dadosAtual = dadosResfazer.splice(0, 1);
                dadosDesfazer.unshift(dadosAtual);
            }
        })

        .end()
        .children('#clear')
        .on('click', () => {
            contexto.clearRect(0, 0, 500, 500);
    });

};