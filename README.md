# sonic-node

The terminal application is an experimentation on the theme of chord progression. It allows building chord progressions and applying arpeggiation to the chords of the progression. Although this explanation seems sequential, you can change the progression or the arpeggiation sequences at any time.

The application has no UI and is driven exclusively by a command language. This document explains the various key concepts of the application and details the command language.

## A quick tour
Let's first take the following example and look at what each line does:

```
scale Eb major
progression {1,5,5,4}
sequence {3,2,1}
```

`scale Eb major` simply indicates the scale we're working with.

`progression {1,5,5,4}` establishes the chord progression. The degree sequence *1,5,5,4* in *Eb major* leads to the following chords: **Eb,Bb,Bb,Ab**. The chord progression will be cycled, stepping through **Eb,Bb,Bb,Ab** at each bar (default case). If no sequence has been defined, the application will play those chords in root position, one after the other.

`sequence {3,2,1}` defines an arpeggiation sequence on each chord. It means play the first note of the chord, then the second, then the third, repeat. By default, the arpeggiation is applied on quarter note basis.

This sequence is then applied on the chord sequence defined above. Since the first chord (**Eb**) in root position is defined by the notes **Eb,G,Bb**, the sequence **{3,2,1}** applied to it will constantly repeat **Bb,G,Eb** until the next chord.

By default, chords in the progression change every bar while the arpeggiation sequence is defined on a quarter note base. This means there is 4 arpeggiation steps for each chord and the full sequence will be expanded to **Bb,G,Eb,Bb,F,D,Bb,F,F,D,Bb,F,Eb,C,Ab,Eb**

## Sequence format

### definition

Both chord progressions and player sequence use a special sequence format. Sequences are described using list of steps separated by braces.

For example, a chord progression is written `{1,4,5,4}` while an arpergiation sequence is written `{1,2,3}`

### base time

Sequences have a base time, which is the time of single a step. Both progression and sequences have a default base time (1 bar for progression and a quarter note for sequences) but it can be overriden using the `base` keyword.

So

```
progression {1,4,5,4} base 1/4
```

 will change the base time to be a quarter note. The `base` argument can be set to **1/16,1/8,1/4,1,2,4**

### rests

You can set a step to have no value by using the rest sign `.`. The sequence `{1,.,3,.}` will play the first note of the chord followed by the third half bar later.

### substeps
Steps can be divided in substeps using parenthesis. Everything that is in between parenthesis counts for a single step element.

For example

```
sequence {1,2,(1,2),3}
```

Will lead to the following rythmic pattern: **&#9833; &#9833; &#9834; &#9834; &#9833;**

You can combine these with rests and odd divisions like `{(.,(1,2),2,(1,2,3),3}`

### group

For sequences, you can group a number of elements together so they happen on the same step.


## Commands

### Termination

`exit`

exits the application

### Chord analysis

`analyse [chords|notes] {chord-list}`

```
analyse chords {Cm, Em}

score: 1
E harmonic minor
```

### Tempo

`Tempo value`

### Scale and Progression

`Scale root-note scale-name`
```
scale D phrygian

> Scale chords: Dm,Eb,F,Gm,Ao,Bb,Cm,
```

You can also flat/sharpen specific degrees of the scale
```
scale c# major
> Scale chords: C#,D#m,E#m,F#,G#,A#m,B#o,

scale c# major {7b}
> Scale chords: C#,D#m,E#o,F#,G#m,A#m,A##,
```

`Progression {degree-sequences}`

Expresses a chord progression relative to the selected scale:

* Use Arabic Numeral (1,2,3,4,..) to refer to the degree of the scale

```
Scale C minor
Progression {1,4,5,4}

> Scale chords: Cm,Do,Eb,Fm,Gm,Ab,Bb,
> Chord sequence: Cm,Fm,Gm,Fm,
```
```
Scale C major
Progression {1,4,5,4}

> Scale chords: C,Dm,Em,F,G,Am,Bo,
> Chord sequence: C,F,G,F,
```

* You can always change the tonality of a degree by specifying 'M' for major and 'm' for minor_numeral

```
Scale C minor
Progression {1M,4,5M,4}

> Scale chords: Cm,Do,Eb,Fm,Gm,Ab,Bb,
> Chord sequence: C,Fm,G,Fm,
```
```
Scale C major
Progression {1,4,5m,4}

> Scale chords: C,Dm,Em,F,G,Am,Bo,
> Chord sequence: C,F,Gm,F,
```

* Alternatively, you can also use roman numerals to specify the degree. Using lower case numeral leads to minor while uppercase leads to major

```
Scale C minor
Progression {i,iv,V,IV}

> Scale chords: Cm,Do,Eb,Fm,Gm,Ab,Bb,
> Chord sequence: Cm,Fm,G,F,
```

### Players and sequences

From the chord progression, up to four player can be set to follow the progression and play notes.

The current concept revolves around a 'player' being active and receiving all player-related commands.

`Player select [1-4]`

Select the current player

`Sequence [load|list|{chord-arp-sequence}] (base x)`

Define a sequence to be applied on the chord progression. You can either use pre-existing sequences using `sequence load` or define one using `sequence {chord-arp-sequence}`
