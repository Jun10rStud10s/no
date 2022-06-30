$( document ).ready( function() {
    var now = new Date()
    var date = new Date(2022, 02, 01);
    var diff = ( ( date.getTime() - now.getTime() ) / 1000 );
    clock = $( '.itbegins' ).FlipClock( diff, { clockFace: 'DailyCounter', countdown: true } );
} );
