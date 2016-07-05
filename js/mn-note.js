var Notes =
{
    NOTES_TO_INTERVALS:
      {cf: -1, CF: -1, Cf: -1, cF: -1,
       cb: -1, CB: -1, Cb: -1, cB: -1,
       c:  0,  C:  0,
       cs: 1,  CS: 1, cS: 1, Cs: 1,
       df: 1,  DF: 1, Df: 1, dF: 1,
       db: 1,  DB: 1, Db: 1, dB: 1,
       d:  2,  D:  2,
       eb: 3,  EB: 3, Eb: 3, eB: 3,
       ef: 3,  EF: 3, Ef: 3, eF: 3,
       ds: 3,  DS: 3, Ds: 3, dS: 3,
       e:  4,  E:  4,
       fb: 4,  FB: 4, Fb: 4, fB: 4,
       ff: 4,  FF: 4, Ff: 4, fF: 4,
       f:  5,  F:  5,
       es: 5,  ES: 5, Es: 5, eS: 5,
       fs: 6,  FS: 6, Fs: 6, fS: 6,
       gb: 6,  GB: 6, Gb: 6, gB: 6,
       gf: 6,  GF: 6, Gf: 6, gF: 6,
       g:  7,  G:  7,
       gs: 8,  GS: 8, Gs: 8, gS: 8,
       ab: 8,  AB: 8, Ab: 8, aB: 8,
       af: 8,  AF: 8, Af: 8, aF: 8,
       a:  9,  A:  9,
       bb: 10, BB: 10, Bb: 10, bB: 10,
       bf: 10, BF: 10, Bf: 10, bF: 10,
       as: 10, AS: 10, As: 10, aS: 10,
       b:  11, B: 11,
       bs: 12, BS: 12, Bs: 12, bS: 12
    }
    ,
    DEFAULT_OCTAVE :4
  ,  
}

var notenames = ["c","c#","d","d#","e","f","f#","g","g#","a","a#","b"];

notefromdegree = function(interval)
{
  if (interval < 0)
  {
    interval = 12 + interval%12;
  }
  else
  {
    interval = interval%12;
  }
  return notenames[interval];
}

intervalfromnotename = function(notename)
{
  for (var index = 0; index < notenames.length; index++)
  {
    if (notename === notenames[index])
    {
      return index;
    }
  }
}

notename = function(midinote)
{
  var note = midinote % 12;
  octave = (midinote - note) / 12 - 1;
  return notenames[note] + octave;
}

var notemap = {};

for (var midinote = 0; midinote < 128; midinote++)
{
  notemap[notename(midinote)] = midinote;
}

n = function(name)
{
  return notemap[name];
}


