/*jshint node: true, browser: true, jquery: true */
/*global io: false */
$(document).ready(function () {
    'use strict';
    var socket = io.connect('http://localhost:3030'),
        myName = '';

    $('#addTask').hide();
    $('#taska').hide();

    console.log('connecting…');

    socket.on('connect', function () {
        console.log('connected!');
    });

    /*
    
    rok.miesiac.dzien

     */

    socket.on('intruz', function(msg){
        $('#login').html('<h1>'+msg+'</h1>')
    });

    socket.on('newTask', function(data){
        console.log("new task");
        $('#active').html('');
        $('#history').html('');
        var dzisiaj = new Date();
        var dzisiajStr = dzisiaj.getFullYear() + '-' + dzisiaj.getMonth() + '-' + dzisiaj.getDate();
        
		for(var i=0; i<data.length; i++){
            if(data[i].status===0){
                var dataZadania = new Date(data[i].data);   
                var dataZadaniaStr = dataZadania.getFullYear() + '-' + dataZadania.getMonth() + '-' + dataZadania.getDate();
                if(dzisiajStr>dataZadaniaStr){
                    if(data[i].user===myName){
                        $('#active').append('<li id="'+i+'" class="arv"><div id="pole" class="'+i+'"<p>'+data[i].nazwa+'<br>'+ data[i].data+'<span class="user">'+data[i].user+'</span></p></div></li>');
                    }else{
                        $('#active').append('<li id="'+i+'" class="arv"><div id="pole" class="'+i+'"<p>'+data[i].nazwa+'<br>'+ data[i].data+'<span>'+data[i].user+'</span></p></div></li>');
                    }
                }else{
                    if(data[i].user===myName){
                        $('#active').append('<li id="'+i+'"><div id="pole" class="'+i+'"<p>'+data[i].nazwa+'<br>'+ data[i].data+'<span class="user">'+data[i].user+'</span></p></div></li>');
                    }else{
                        $('#active').append('<li id="'+i+'"><div id="pole" class="'+i+'"<p>'+data[i].nazwa+'<br>'+ data[i].data+'<span>'+data[i].user+'</span></p></div></li>');
                    }
                }
            }else{
                $('#history').append('<li id="'+i+'"><div id="pole" class="'+i+'"><p>'+data[i].nazwa+'<br>'+ data[i].data+'<span>'+data[i].user+'</span></p></div><button id="del" class="'+i+'">Usun</button></li>');
            }   
        }

        $("li #pole").click(function (a){
            socket.emit('change', $(this).attr('class'));
        });

        $('li #del').click(function (){
            socket.emit('delete', $(this).attr('class'));
        });

    });

    socket.on('yourTask', function (data){
        console.log(data.length);
        var dzisiaj = new Date();
        var dzisiajStr = dzisiaj.getFullYear() + '-' + dzisiaj.getMonth() + '-' + dzisiaj.getDate();
        
		for(var i=0; i<data.length; i++){
            if(data[i].status===0){
                var dataZadania = new Date(data[i].data);   
                var dataZadaniaStr = dataZadania.getFullYear() + '-' + dataZadania.getMonth() + '-' + dataZadania.getDate();
                if(dzisiajStr>dataZadaniaStr){
                    if(data[i].user===myName){
                        $('#active').append('<li id="'+i+'" class="arv"><div id="pole" class="'+i+'"<p>'+data[i].nazwa+'<br>'+ data[i].data+'<span class="user">'+data[i].user+'</span></p></div></li>');
                    }else{
                        $('#active').append('<li id="'+i+'" class="arv"><div id="pole" class="'+i+'"<p>'+data[i].nazwa+'<br>'+ data[i].data+'<span>'+data[i].user+'</span></p></div></li>');
                    }
                }else{
                    if(data[i].user===myName){
                        $('#active').append('<li id="'+i+'"><div id="pole" class="'+i+'"<p>'+data[i].nazwa+'<br>'+ data[i].data+'<span class="user">'+data[i].user+'</span></p></div></li>');
                    }else{
                        $('#active').append('<li id="'+i+'"><dsiv id="pole" class="'+i+'"<p>'+data[i].nazwa+'<br>'+ data[i].data+'<span>'+data[i].user+'</span></p></div></li>');
                    }
                }
            }else{
                //append -> dokumentacja jQuery -> dodawanie KOLEJNYCH elementow (nie nadpisywanie)
                $('#history').append('<li id="'+i+'"><div id="pole" class="'+i+'"><p>'+data[i].nazwa+'<br>'+ data[i].data+'<span>'+data[i].user+'</span></p></div><button id="del" class="'+i+'">Usun</button></li>');
            }    
        }

        $('#login').hide();
        $('#addTask').show();
        $('#taska').show();

        $("li #pole").click(function (a){
            socket.emit('change', $(this).attr('class'));
        });

        $('li #del').click(function (){
            socket.emit('delete', $(this).attr('class'));
        });

    });

    $('#zaloguj').click( function (event){
        socket.emit('setUser', $('#userLogin').val());//Wyemitowanie zdarzenia o nazwie 'setUser', z parametrem z inputa do serwera
        myName = $('#userLogin').val();
    });

    $('#add').click(function (event){
        var nazwa = $('#nazwa').val();
        var adresat = $('#user').val();
        var termin= $('#termin').val();
        var status = 0;
        socket.emit('addTask', {nazwa: nazwa, data: termin, user: adresat, status: status});
    });

   
});
