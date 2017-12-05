# Future

## Sequences

Warning, this won't work with voicing.

Do not use chord note but relative degree so the old {1,2,3} becomes {1,3,5}

Kill inversion and use a transpose sign so that inversion can be expressed with {1,-3,-5}, {1, 3,-5}. Transposition can be done several times {1, --3, ++5 }

## comments - allow # at the end of lines

## syntax
Rather than having everything always defined on a single line, it'd be better to be able to uses blocks. For example:

```
progression
{
  1,5,5,4
}
```
is equivalent to `progression {1,5,5,4}`

Triggering a command using **shift+enter** will trigger the whole block the cursor's in.

## progression

**norepeat** (play the sequence once and the stop)
**noreset** (do not reset the sequence when a new chord is triggered)

## sections / macros

use sections to group a set of command together. Something like

```
p1:
{
  sequence {1,-3,-5}
  legato 90
  transpose -4
}

a:
{
  progression {1,5,5,4}
  player 1 p1
  player 2 p2
  length 8
}

chain {a,b,c} #plays sucessvely section a,b,c
```
