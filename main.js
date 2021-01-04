$(document).ready(function () {
  let kalade = [
    (suit = ["S", "C", "D", "H"]),
    (value = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "10J",
      "10Q",
      "10K",
      "11A",
    ]),
    (cards = []),
    (index = []),
  ];
  let handCard = {
    card: [],
    weight: [],
  };

  // prasuku loopa pro value ir suit , kad sujungtu kortu spalvas su reiksmemis
  for (let i = 0; i < value.length; i++) {
    for (let j = 0; j < suit.length; j++) {
      // push() - ikeliu gautas kortas i cards[] masyva
      cards.push(value[i] + suit[j]);
    }
  }
  $("h5", "#index").append(cards.length + " cards left");

  // #startGame pradzioje zaidimo duoda dvi kortas
  $("#startGame").click(function () {
    var first = Math.floor(Math.random() * cards.length);
    var fir = cards.splice(first, 1);
    var second = Math.floor(Math.random() * cards.length);
    var sec = cards.splice(second, 1);
    handCard.card.push(fir);
    handCard.card.push(sec);
    $("h5", "#index").remove();
    let pirma = fir[0];
    let antra = sec[0];
    $("#pirmas").append('<img  src="assets/img/cards/' + pirma + '.png" />');
    $("#pirmas").append('<img  src="assets/img/cards/' + antra + '.png" />');
    var firWeight = parseInt(fir);
    var secWeihgt = parseInt(sec);
    handCard.weight.push(firWeight);
    handCard.weight.push(secWeihgt);
    var suma = handCard.weight.reduce((a, b) => a + b, 0);
    if (suma == 21 || suma == 22) {
      $("h3", "#cards").append("<h1>  <b> BLACK  JACK </b> </h1>");
      $("#buttons").remove();
    }
    $("h2", "#playerPoints").append(suma);

    $("#index").append(`<h5>${cards.length} cards left</h5>`);

    if (handCard.card.length == 2) {
      $("#startGame").remove();
      $("#buttons").append("<button id='stillCard'>Still Card</button>");
      $("#buttons").append("<button id='enough'>Enough</button>");
    }

    // #stillCard duoda dar viena korta
    $("#stillCard").click(function () {
      $("h5", "#index").remove();
      var oneMore = Math.floor(Math.random() * cards.length);
      var one = cards.splice(oneMore, 1);
      handCard.card.push(one);
      var oneWeight = parseInt(one);
      handCard.weight.push(oneWeight);
      $("#index").append(`<h5>${cards.length} cards left</h5>`);
      if (cards.length == 0) {
        $("h5", "#index").remove();
        $("#index").append("<h5>" + "NO MORE CARDS" + "</h5>");
      }
      suma = handCard.weight.reduce((a, b) => a + b, 0);

      $("#pirmas").append('<img  src="assets/img/cards/' + one + '.png" />');

      // if (suma > 21) {
      //   $("h3", "#cards").append(" <h1>  <b>  You're a loser </b> </h1>");
      //   $("#buttons").remove();
      // }
      // if (suma == 21) {
      //   $("h3", "#cards").append("<h1>  <b>BLACK  JACK </b> </h1>");
      //   $("#buttons").remove();
      // }
      $("h2", "#playerPoints").remove();
      $("#playerPoints").append(`<h2>${suma}</h2>`);
    });
    $("#enough").click(function () {
      $("#buttons").remove();
      kompiuteris();
    });
  });

  function kompiuteris() {
    alert(
      "FUNKCIJA PALEISTA :\n ČIA BUS FUNKCIJA KOMPIUTERIO KORTOMS GENERUOTI"
    );
  }
});
