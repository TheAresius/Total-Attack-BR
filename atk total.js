function atk_total() {
  var ATK = document.getElementById("Ataque").value;
  var DEF = document.getElementById("Defesa").value;
  var HP = document.getElementById("HP").value;
  var sATK = document.getElementById("Ataque_Especial").value;
  var sDEF = document.getElementById("Defesa_Especial").value;
  var crit_r = document.getElementById("Critico").value;
  var crit_d = document.getElementById("Dano_Critico").value;
  var rec_HP = document.getElementById("Recuperar_HP").value;
  var rec_MP = document.getElementById("Recuperar_MP").value;

  // decimal separator fix
  ATK = Number(ATK.replace(/,/g,"."))
  DEF = Number(DEF.replace(/,/g,"."))
  HP = Number(HP.replace(/,/g,"."))
  sATK = Number(sATK.replace(/,/g,"."))
  sDEF = Number(sDEF.replace(/,/g,"."))
  crit_r = Number(crit_r.replace(/,/g,"."))
  crit_d = Number(crit_d.replace(/,/g,"."))
  rec_HP = Number(rec_HP.replace(/,/g,"."))
  rec_MP = Number(rec_MP.replace(/,/g,"."))

  crit_r = crit_r/100
  crit_d = 1.2 + crit_d/100
  
  // offensive related
  var o1 = 0.8 * ATK
  var o2 = 7407/125 * (ATK + sATK) * (100 + rec_MP) * (1/10000)
  var o3 = (o1 + o2) * ((1 - crit_r) + crit_r * crit_d)

  // defensive related
  var d1 = (DEF * 0.7) + (sDEF * 0.14)
  var d2 = (HP + (HP * rec_HP/100))*0.7
  var d3 = d1 + d2

  

  var final_result = Math.round(o3 + d3)
  var est_error = Math.round(0.000089 * (o3 + d3))
  
  if (check_error(ATK, DEF, HP, sATK, sDEF,crit_r, crit_d, rec_HP, rec_MP)){
    result.innerHTML = `<div>${"Ataque Total: "} <span class="yellow">${final_result} ± ${est_error}</span>`;
    
  } else {
    result.innerHTML =`<div> ${"Ataque Total: "}<span class = "yellow">${'-'}</span>`;
    result.innerHTML +=`<div> <span class = "error">Reveja os valores inseridos.</span>`
  }
}

// return True means there's an error
function check_error(ATK, DEF, HP, sATK, sDEF,crit_r, crit_d, rec_HP, rec_MP) {
  var list = [ATK, DEF, HP, sATK, sDEF, crit_r, crit_d, rec_HP, rec_MP];
  var test_values = true;

  for (var i = 0; i < list.length; i++) {
    if (isNaN(list[i]) || list[i] < 0) {
      test_values = false;
      break;
    }
  }

  return test_values;
}