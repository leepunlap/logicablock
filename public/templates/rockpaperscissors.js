//
//  This is a sample program for Logica Block
//

function lbOnRemote(id,button) {

  computer_choice = "i" + Math.floor((Math.random() * 3) + 1);

  if (button == 'A') {
    user_choice = 'i1';
  } else if (button == 'B') {
    user_choice = 'i2';
  } else if(button == 'C') {
    user_choice = 'i3';
  }

  lbCopy(user_choice,'o1');
  lbCopy(computer_choice,'o2');

  setTimeout(function() {
    if (user_choice == computer_choice) {
      lbClear('o1');
      lbClear('o2');
    } else if (user_choice == 'i1' && computer_choice == 'i2') {
      lbCopy('i4','o2');
      lbClear('o1');
    } else if (user_choice == 'i2' && computer_choice == 'i3') {
      lbCopy('i4','o2');
      lbClear('o1');
    } else if (user_choice == 'i3' && computer_choice == 'i1') {
      lbCopy('i4','o2');
      lbClear('o1');
    } else {
      lbCopy('i4','o1');
      lbClear('o2');
    }
  },2000)

}
