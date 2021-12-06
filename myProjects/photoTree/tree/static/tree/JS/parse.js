
let data = [
  {
    "image": 1,
    "mother": 9,
    "spouse": null,
    "birthyear": 2006
  },
  {
    "image": 2,
    "mother": 9,
    "spouse": null,
    "birthyear": 2004
  },
  {
    "image": 3,
    "mother": 9,
    "spouse": null,
    "birthyear": 2002
  },
  {
    "image": 4,
    "mother": 9,
    "spouse": null,
    "birthyear": 2010
  },
  {
    "image": 5,
    "mother": 9,
    "spouse": null,
    "birthyear": 2008
  },
  {
    "image": 6,
    "mother": 9,
    "spouse": null,
    "birthyear": 2013
  },
  {
    "image": 7,
    "mother": 9,
    "spouse": null,
    "birthyear": 2001
  },
  {
    "image": 8,
    "mother": 11,
    "spouse": 9,
    "birthyear": 1978
  },
  {
    "image": 9,
    "mother": 10,
    "spouse": 8,
    "birthyear": 1979
  },
  {
    "image": 10,
    "mother": null,
    "spouse": null,
    "birthyear": 1950
  },
  {
    "image": 11,
    "mother": null,
    "spouse": 12,
    "birthyear": 1955
  },
  {
    "image": 12,
    "mother": null,
    "spouse": 11,
    "birthyear": 1955
  },
  {
    "image": 13,
    "mother": 11,
    "spouse": 14,
    "birthyear": 1980
  },
  {
    "image": 14,
    "mother": null,
    "spouse": 13,
    "birthyear": 1979
  },
  {
    "image": 15,
    "mother": 11,
    "spouse": 17,
    "birthyear": 1984
  },
  {
    "image": 16,
    "mother": 15,
    "spouse": null,
    "birthyear": 2005
  },
  {
    "image": 17,
    "mother": null,
    "spouse": 15,
    "birthyear": 1981
  },
]

//Adds all photos to left side of screen, just for testing, will need to change eventually
for (let i = 0; i < data.length; ++i) {
  let pic = data[i].image.toString()
  let year = data[i].birthyear.toString()
  document.getElementById('nodes').innerHTML += `<div class="node"><img class="photo" src="../../static/tree/images/pictures/${pic}.PNG"/>
  <span style='margin-top:5px;'>${year}</span></div>`
}


//Defines class to be used for the objects of the values in momMap
class mom {

  children = []
  spouse = null

  addChild(child) {
    this.children.push(child)
  }

  addSpouse(spouse) {
    this.spouse = spouse;
  }
}


let momMap = new Map()

function TestMap() {
  //Initializes map with a key of each person in data inputs
  for (let i = 0; i < data.length; ++i) {
    momMap.set(data[i], new mom())
  }


  //Appends children and husbands to key of mothers, appends to Object data members 
  for (let i = 0; i < data.length; ++i) {
    if (data[i].mother != null) { 
      momMap.get(data[data[i].mother - 1]).addChild([data[i]])
    }
    if (data[i].spouse != null) {
      momMap.get(data[data[i].spouse - 1]).addSpouse([data[i]])
    }
  }

  //Cleans out map so that non-mothers are deleted, since tree is based around Mothers others shouldn't be needed
  for (let [key, value] of  momMap.entries()) {
    if (value.children.length === 0) {
      momMap.delete(key)
    }
  }

  console.log(momMap)
}
