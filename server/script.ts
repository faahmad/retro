/**
  * 
  * This code was auto-generated based on the introspection result.
  * Consider it a playground to explore the Photon API.
  * Feel free to change it as much as you like or delete it altogether.
  *
  * The model `User` was randomly selected to demonstrate some API calls.
  *
  * Tip: Use the auto-completion of your editor to explore available API operations.
  * 
  */

import { Photon } from '@generated/photon'
const photon = new Photon()

async function main() {
  // Tip: Explore some arguments to `findMany` 
  const allUsers = await photon.users.findMany()
  console.log(`Retrieved all published users: `, allUsers)

  // Comment out the lines below to create a new User
  // ATTENTION: This code creates a new record in your database
  // const newUser = await photon.users.create({
  //   data: {
  //     // add some values here
  //   },
  // })
  // console.log(`Created a new User: `, newUser)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await photon.disconnect()
  })