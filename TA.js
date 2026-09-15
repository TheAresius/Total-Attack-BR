const WEIGHTS = {
  atk: 0.01197666,
  def: 0.00068,
  hp: 0.00084,
  spa: 0.00651422,
  spDef: 0.000176,
  backAttackDmg: 135.00022,
  hpRecovery: 0.08,
  mpRecovery: 41.89112,
  character_MP: 1,
  character_AP: 1.4,
  allSkillDmg: 56.2176,
  bossDmg: 38.25,
  polarize: 40.53,
  normalSkillDmg: 135.00022 * (8/25),
  awkSkillDmg: 135.00022 * (8/25),
  mp1Dmg: 56.2176 * 0.6, 
  mp2Dmg: 56.2176 * 0.6, 
  mp3Dmg: 56.2176 * 0.6, 
  mp4Dmg: 56.2176 * (3/7),
  mpCost: 12.992412,
  mp1Cost: 12.992412 * 0.6,
  mp2Cost: 12.992412 * 0.6,
  mp3Cost: 12.992412 * 0.6,
  mp4Cost: 12.992412 * (3/7),
  generalCD: 16.9902,
  mp1CD: 16.9902 * 0.6,
  mp2CD: 16.9902 * 0.6,
  mp3CD: 16.9902 * 0.6,
  mp4CD: 16.9902 * (3/7),
  hellSpearChance: 20.2489,
  hellSpearDmg: 0.00027,
  critDmgRed: 0.84,
};

function getVal(id, isPercent = true) {
  var input = document.getElementById(id);
  if (!input) return 0; 
  if (input.validity && input.validity.badInput) return NaN;
  if (input.value === "") return 0; 
  
  var val = Number(input.value.replace(/,/g, "."));

  if (isNaN(val) || val < 0) return NaN;
  if (isPercent) {return val / 100}
  
  return val;
}

function crit_normalize(crit) {
  var w0 = 1.0; // 0% ~ 100% range
  var w1 = 0.6; // 100% ~ 120% range
  var w2 = 0;   // 120% onwards

  if (crit <= 1.0) {
    return crit * w0 ;

  } else if (crit <= 1.2) {
    return 1 + (crit - 1.0) * w1; // crit rate above 100% is normalized by 60%

  } else {
    return 1 + 0.2 * w1 + (crit - 1.2) * w2; //crit rate above 120% is ignored
  }
}


function TA() {
  var atk = getVal("attack", false);
  var def = getVal("defense", false);
  var hp = getVal("hp", false);
  var spa = getVal("special_attack", false);
  var spDef = getVal("special_defense", false);
  var critChance = getVal("crit_chance", true);
  var critDamage = getVal("crit_damage", true);
  var backAttackDmg = getVal("back_attack_dmg", true);
  var hpRecovery = getVal("hp_recovery", true);
  var mpRecovery = getVal("mp_recovery", true);
  var allSkillDmg = getVal("all_skill_dmg", true);
  var bossDmg = getVal("boss_dmg", true);
  var polarize = getVal("polarize", true);
  var normalSkillDmg = getVal("normal_skill_dmg", true);
  var awakeningSkillDmg = getVal("awk_skill_dmg", true);
  var mp1Dmg = getVal("mp1_dmg", true);
  var mp2Dmg = getVal("mp2_dmg", true);
  var mp3Dmg = getVal("mp3_dmg", true);
  var mp4Dmg = getVal("mp4_dmg", true);
  var mpCost = getVal("mp_cost", true);
  var mp1Cost = getVal("mp1_cost", true);
  var mp2Cost = getVal("mp2_cost", true);
  var mp3Cost = getVal("mp3_cost", true);
  var mp4Cost = getVal("mp4_cost", true);
  var generalCD = getVal("general_cd", true);
  var mp1CD = getVal("mp1_cd", true);
  var mp2CD = getVal("mp2_cd", true);
  var mp3CD = getVal("mp3_cd", true);
  var mp4CD = getVal("mp4_cd", true);
  var hellSpearDmg = getVal("hell_spear_dmg", false); 
  var hellSpearChance = getVal("hell_spear_chance", true);
  var critDmgRed = getVal("crit_dmg_red", true); 

  var allVars = [
    atk,
    def,
    hp,
    spa,
    spDef,
    critChance,
    critDamage,
    backAttackDmg,
    hpRecovery,
    mpRecovery,
    allSkillDmg,
    bossDmg,
    polarize,
    normalSkillDmg,
    awakeningSkillDmg,
    mp1Dmg,
    mp2Dmg,
    mp3Dmg,
    mp4Dmg,
    mpCost,
    mp1Cost,
    mp2Cost,
    mp3Cost,
    mp4Cost,
    generalCD,
    mp1CD,
    mp2CD,
    mp3CD,
    mp4CD,
    hellSpearDmg,
    hellSpearChance,
    critDmgRed,
  ];
  
  if (allVars.includes(NaN)) {
    var result = document.getElementById("result");
    result.innerHTML = `<div>Ataque Total: <span class="yellow">-</span></div>`;
    result.innerHTML += `<div><span class="error">Reveja os valores inseridos.</span></div>`;
    return;
  }

  var crit_fixed = 67.5 * crit_normalize(critChance);
  
  var offensive = (atk * WEIGHTS.atk)
                + (spa * WEIGHTS.spa)
                + (critDamage * crit_fixed )              
                + (backAttackDmg * WEIGHTS.backAttackDmg)
                + (allSkillDmg * WEIGHTS.allSkillDmg)
                + (bossDmg * WEIGHTS.bossDmg)
                + (polarize * WEIGHTS.polarize)
                + (normalSkillDmg * WEIGHTS.normalSkillDmg)
                + (awakeningSkillDmg * WEIGHTS.awkSkillDmg)
                + (mp1Dmg * WEIGHTS.mp1Dmg)
                + (mp2Dmg * WEIGHTS.mp2Dmg)
                + (mp3Dmg * WEIGHTS.mp3Dmg)
                + (mp4Dmg * WEIGHTS.mp4Dmg)
                + (hellSpearChance * WEIGHTS.hellSpearChance)
                + (hellSpearDmg * WEIGHTS.hellSpearDmg);
                
  var defensive = (def * WEIGHTS.def)
                + (hp * WEIGHTS.hp)
                + (critDmgRed * WEIGHTS.critDmgRed)
                + (spDef * WEIGHTS.spDef)
                + (hpRecovery * WEIGHTS.hpRecovery);

  var characterType = document.getElementById("character_type") ? document.getElementById("character_type").value : "MP";
  var mp_custom_weight = (characterType === "AP") ? WEIGHTS.character_AP : WEIGHTS.character_MP;

  var support = (mpRecovery * WEIGHTS.mpRecovery * mp_custom_weight)
              + (mpCost * WEIGHTS.mpCost)
              + (mp1Cost * WEIGHTS.mp1Cost)
              + (mp2Cost * WEIGHTS.mp2Cost)
              + (mp3Cost * WEIGHTS.mp3Cost)
              + (mp4Cost * WEIGHTS.mp4Cost)
              + (generalCD * WEIGHTS.generalCD)
              + (mp1CD * WEIGHTS.mp1CD)
              + (mp2CD * WEIGHTS.mp2CD)
              + (mp3CD * WEIGHTS.mp3CD)
              + (mp4CD * WEIGHTS.mp4CD);

  var k1 = 130.1936693
  var k2 = 0.549624
  var offensive_fix = k1 + offensive * k2 // this term is used to ensure the Offensive part of the stats are the main source of TA increase
  
  var finalResult = (offensive + defensive + support) * offensive_fix;
  var result_out = Math.floor(finalResult).toLocaleString('pt-BR')
  var error_out = Math.floor(finalResult * 6e-4)

  var resultElement = document.getElementById("result");
  resultElement.innerHTML = `<div>Ataque Total: <span class="yellow">${result_out} ± ${error_out}</span></div>`;
}