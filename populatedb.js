#! /usr/bin/env node

console.log(
  'This script populates some creatures, types, sources and creature instances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Creature = require('./models/creature');
const Source = require('./models/source');
const Type = require('./models/type');
const CreatureInstance = require('./models/creatureinstance');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let creatures = [];
let sources = [];
let types = [];
let creatureInstances = [];

function sourceCreate(name, descr, cb) {
  let srcDetail = { name };
  if (descr != false) srcDetail.description = descr;
  let source = new Source(srcDetail);

  source.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Source: ' + source);
    sources.push(source);
    cb(null, source);
  });
}

function typeCreate(name, descr, cb) {
  let typeDetail = { name };
  if (descr != false) typeDetail.description = descr;
  let type = new Type(typeDetail);

  type.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Type: ' + type);
    types.push(type);
    cb(null, type);
  });
}

function creatureCreate(name, history, size, type, source, cb) {
  creatureDetail = { name, history, size, type, source };

  let creature = new Creature(creatureDetail);

  creature.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Creature ' + creature);
    creatures.push(creature);
    cb(null, creature);
  });
}

function creatureInstanceCreate(creature, name, history, cb) {
  let creatureInstance = new CreatureInstance({
    creature,
    name,
    history,
  });

  creatureInstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING CreatureInstance :' + creatureInstance);
      cb(err, null);
      return;
    }
    console.log('New CreatureInstance :' + creatureInstance);
    creatureInstances.push(creatureInstance);
    cb(null, creatureInstance);
  });
}

function createSourcesTypes(cb) {
  async.series(
    [
      function (callback) {
        sourceCreate(
          'Greek Mythology',
          'A major branch of classical mythology, Greek mythology is the body of myths originally told by the ancient Greeks, and a genre of Ancient Greek folklore. These stories concern the origin and nature of the world, the lives and activities of deities, heroes, and mythological creatures, and the origins and significance of the ancient Greeks own cult and ritual practices. Modern scholars study the myths to shed light on the religious and political institutions of ancient Greece, and to better understand the nature of myth-making itself.',
          callback
        );
      },
      function (callback) {
        sourceCreate(
          'Irish Folklore',
          'Irish folklore, when mentioned to many people, conjures up images of banshees, fairy stories, leprechauns and people gathering around, sharing stories. Many tales and legends were passed from generation to generation, so were the dances and song in the observing of important occasions such as weddings, wakes, birthdays and holidays or, handcraft traditions. All of the above can be considered as a part of folklore, as it is the study and appreciation of how people lived.',
          callback
        );
      },
      function (callback) {
        sourceCreate(
          'Norse Mythology',
          'Norse or Scandinavian mythology is the body of myths of the North Germanic peoples, stemming from Norse paganism and continuing after the Christianization of Scandinavia, and into the Scandinavian folklore of the modern period. The northernmost extension of Germanic mythology and stemming from Proto-Germanic folklore, Norse mythology consists of tales of various deities, beings, and heroes derived from numerous sources from both before and after the pagan period, including medieval manuscripts, archaeological representations, and folk tradition.',
          callback
        );
      },
      function (callback) {
        typeCreate(
          'Giant',
          "In folklore, giants (from Ancient Greek: gigas, cognate giga-) are beings of human-like appearance, but are at times prodigious in size and strength or bear an otherwise notable appearance. The word giant is first attested in 1297 from Robert of Gloucester's chronicle It is derived from the Gigantes (Greek: Γίγαντες) of Greek mythology. ",
          callback
        );
      },
      function (callback) {
        typeCreate(
          'Beast',
          'A beast is similar to an animal,but they are often fantastical.Examples include griffons,krakens or the chimera.',
          callback
        );
      },
      function (callback) {
        typeCreate(
          'Undead',
          'The undead are beings in mythology, legend, or fiction that are deceased but appear to be alive. Most commonly the term refers to corporeal forms of formerly-alive humans, such as mummies, vampires, and zombies, who have been reanimated by supernatural means, technology, or disease. In some cases (for example in Dungeons & Dragons) the term also includes incorporeal forms of the dead, such as ghosts.',
          callback
        );
      },
    ],
    cb
  );
}

function createCreatures(cb) {
  async.parallel(
    [
      function (callback) {
        creatureCreate(
          'Cyclopes',
          'In Greek mythology and later Roman mythology, the Cyclopes  Greek: Κύκλωπες, Kýklōpes, "Circle-eyes" or "Round-eyes" singular Cyclops Κύκλωψ, Kýklōps) are giant one-eyed creatures. Three groups of Cyclopes can be distinguished. In Hesiod\'s Theogony, the Cyclopes are the three brothers Brontes, Steropes, and Arges, who made for Zeus his weapon the thunderbolt. In Homer\'s Odyssey, they are an uncivilized group of shepherds, the brethren of Polyphemus encountered by Odysseus. Cyclopes were also famous as the builders of the Cyclopean walls of Mycenae and Tiryns.',
          'Huge',
          sources[0],
          [types[0]],
          callback
        );
      },
      function (callback) {
        creatureCreate(
          'Jotunn',
          'A jötunn (in the normalised scholarly spelling of Old Norse, jǫtunn) or, in Old English, eoten (plural eotenas) is a type of supernatural being in Germanic mythology. In Norse mythology, they are often contrasted with gods (Æsir and Vanir) and other non-human figures, such as dwarfs and elves, although the groupings are not always mutually exclusive. The entities themselves are referred to by several other terms, including risi, þurs (or thurs) and troll if male and gýgr or tröllkona if female. The jötnar typically dwell across boundaries from the gods and humans in lands such as Jötunheimr.',
          'Huge',
          sources[2],
          [types[0]],
          callback
        );
      },
      function (callback) {
        creatureCreate(
          'Banshee',
          'A banshee ,("woman of the fairy mound" or "fairy woman") is a female spirit in Irish folklore who heralds the death of a family member, usually by wailing, shrieking, or keening. Her name is connected to the mythologically important tumuli or "mounds" that dot the Irish countryside, which are known as síde (singular síd) in Old Irish',
          'Medium',
          sources[1],
          [types[2]],
          callback
        );
      },
      function (callback) {
        creatureCreate(
          'Kraken',
          'Originating in Scandinavian folklore, the kraken is usually depicted as an aggressive cephalopod-like creature capable of destroying entire ships and dragging sailors to their doom.',
          'Gargantuan',
          sources[2],
          [types[1]],
          callback
        );
      },
    ],
    cb
  );
}

function createCreatureInstances(cb) {
  async.parallel(
    [
      function (callback) {
        creatureInstanceCreate(
          creatures[0],
          'Polyphemus',
          'Polyphemus ( Greek: Πολύφημος, translit. Polyphēmos,  Latin: Polyphēmus ) is the one-eyed giant son of Poseidon and Thoosa in Greek mythology, one of the Cyclopes described in Homer\'s Odyssey. His name means "abounding in songs and legends". Polyphemus first appeared as a savage man-eating giant in the ninth book of the Odyssey. The satyr play of Euripides is dependent on this episode apart from one detail; for comic effect, Polyphemus is made a pederast in the play. Later Classical writers presented him in their poems as heterosexual and linked his name with the nymph Galatea. Often he was portrayed as unsuccessful in these, and as unaware of his disproportionate size and musical failings.[2] In the work of even later authors, however, he is presented as both a successful lover and skilled musician. From the Renaissance on, art and literature reflect all of these interpretations of the giant.',
          callback
        );
      },
      function (callback) {
        creatureInstanceCreate(
          creatures[1],
          'Ymir',
          "In Norse mythology, Ymir, also called Aurgelmir, Brimir, or Bláinn, is the ancestor of all jötnar. Ymir is attested in the Poetic Edda, compiled in the 13th century from earlier traditional material, in the Prose Edda, written by Snorri Sturluson in the 13th century, and in the poetry of skalds. Taken together, several stanzas from four poems collected in the Poetic Edda refer to Ymir as a primeval being who was born from venom that dripped from the icy rivers called the Élivágar, and lived in the grassless void of Ginnungagap. Ymir gave birth to a male and female from his armpits, and his legs together begat a six-headed being. The grandsons of Búri, the gods Odin, Vili and Vé, fashioned the Earth (elsewhere personified as a goddess, Jörð) from his flesh, from his blood the ocean, from his bones the mountains, from his hair the trees, from his brains the clouds, from his skull the heavens, and from his eyebrows the middle realm in which mankind lives, Midgard. In addition, one stanza relates that the dwarfs were given life by the gods from Ymir's flesh and blood (or the Earth and sea).",
          callback
        );
      },
      function (callback) {
        creatureInstanceCreate(
          creatures[1],
          'Gerðr',
          'n Norse mythology, Gerðr  is a jötunn, goddess, and the wife of the god Freyr. Gerðr is attested in the Poetic Edda, compiled in the 13th century from earlier traditional sources; the Prose Edda and Heimskringla, written in the 13th century by Snorri Sturluson; and in the poetry of skalds. Gerðr is sometimes modernly anglicized as Gerd or Gerth.',
          callback
        );
      },
      function (callback) {
        creatureInstanceCreate(
          creatures[2],
          'Hag of the Black Head',
          "In Gaelic (Irish, Scottish and Manx) myth, the Cailleach  is a divine hag and ancestor, associated with the creation of the landscape and with the weather, especially storms and winter. The word literally means 'old woman, hag', and is found with this meaning in modern Irish and Scottish Gaelic, and has been applied to numerous mythological and folkloric figures in Ireland, Scotland, and the Isle of Man.In modern Irish folklore studies she is also known as The Hag of Beara, while in Scotland she is also known as Beira, Queen of Winter.",
          callback
        );
      },
    ],
    cb
  );
}

async.series(
  [createSourcesTypes, createCreatures, createCreatureInstances],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('CREATUREInstances: ' + creatureInstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
