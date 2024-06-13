const api = 'https://ib.komisc.ru/vm/get.php?personAll'
const baseUrl = 'https://ib.komisc.ru'
fetch(api, {
  method: 'POST',
})
  .then(response => response.json())
  .then(data => {
    personData = data.person
    persons = personData.map(person => `${person.F} ${person.I} ${person.O}`)
    console.log(data)
  })