# Total Attack Calculator - Grand Chase
Hi. This is a Total Attack calculator for Grand Chase Classic. You can check this and other calculators in [here](https://linktr.ee/thearesius).
## Mathematical and computational models used
 All data was gathered through the stats window in Grand Chase.
- Tesseract OCR (through [pytesseract](https://github.com/madmaze/pytesseract)) was used to automate the data gathering;
- [Differential Evolution](https://github.com/TheAresius/Differential-Evolution-for-data-fitting) was used to fit the gathered data in order to compare it to a previous mathematical model;
- Python Symbolic Regression ([PySR](https://github.com/astroautomata/PySR)) was used to refine the results and find more intricate elements in the formula.

## Introduction
After the first TA formula, I had a pretty good idea on how it worked, so I didn't start from scratch.
When observing some stats in the game, some of them seemed to be independent on one another, so I started working from there.

The most basic model for a high-order mathematical function is a linear combination of terms, i.e.:
<p align=center>
  $f(\mathbf{x}) = x_1w_1 + x_2w_2 + x_3w_3+ \cdots +x_nw_n$
</p>

where $w_1$, $w_2$, $w_3$, $\cdots$, $w_n$ are the weights associated to each variable $\mathbf{x}$.

As it turns out, this exact approach is how the developers built the new TA formula!
Models like this are extremely easy to work with, because variables are not coupled. A change in any single variable yields a shift in TA proportional strictly to that variable's weight.

The only coupled variables are the critical damage and critical rate. This allow us to find all the weights for each stat, and then, find the coupling method for the critical damage.

The complete formula looks like:
<p align = center>
    $TA = (\text{offensive} + \text{defensive} + \text{support}) \times (k_1 + k2 \times \text{offensive})$
</p>

- In the offensive part we have values that directly change your damage (attack, special attack, critical damage, back attack damage, boss damage, all skill damage etc);
- In the defensive part we have values that helps on survival (defense, HP, special defense, critical damage reduction, hp recovery);
- In the support part we have stats that indirectly contribute to the damage (mp recovery, mp cost reduction, cooldown reduction).

## Critical Chance and Critical Damage
When trying to figure out the weight for Critical Damage, nothing worked, so instead I assumed they used the previous method — they multiply critical rate $\times$ critical damage.
By doing this, critical rate and critical rate have its own contribution, instead of a weight in the usual sense.

Critical Rate has a couple of efficiency intervals: 

<p align =center>
  $$
  \left\{ \begin{array}{ll}
  \text{crit chance between 0 - 100%} & : \text{weight}=1\\
  \text{crit chance between 100 - 120%} & : \text{weight}=0.6\\
  \text{crit chance above 120%} & : \text{weight}=0
  \end{array} \right.
  $$
</p>

Critical Damage simply multiply the critical rate.

## MP Recovery
Now different characters have different weights for MP Recovery. Those weights depend on whether the character is MP type or AP type.  For MP characters the weight is 1, for AP characters the weight is 1.4.

## Skill Runes
The weights for MP1/MP2/MP3/MP4 are based on the weights for all skills. For example: 'MP2 Cooldown Reduction' weight depends on the weight of 'All Skill Cooldown Reduction'.  They are distributed as such: 
<p align = center>
  $$
  \left\{ \begin{array}{cl}
    \ \text{All Skill} & : \text{weight}=W\\
    \ \text{MP1/MP2/MP3} & : \text{weight}=0.6W\\
    \ \text{MP4} & : \text{weight}=\frac{3}{7}W
    \end{array} \right.
  $$
</p>

  That's pretty much all the shenanigans for this new TA formula. All weights are written explicitly inside `TA.js`. Feel free to check it out!