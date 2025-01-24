import Container from '@/components/Container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const ContactPage = () => {
  return (
    <div>
      <Container className='max-w-3xl px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-3xl font-bold mb-6 text-darkColor'>Contacter Nous</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
  Vous avez une question ou besoin de conseils pour atteindre vos objectifs ? 
  Notre équipe est là pour vous aider ! Remplissez le formulaire ci-dessous et 
  obtenez une réponse rapide et personnalisée. Ne laissez pas vos ambitions attendre !
</p>
<form action="" className='space-y-4'>

  <div className='space-y-0.5'>
    <Label htmlFor="name">Nom</Label> 
    <Input type="text" id="name" name='name' placeholder="Votre nom"  className='w-full  px-3
    py-2 border border-SecondaryColor rounded-md' required/>
  </div>
  <div className='space-y-0.5'>
    <Label htmlFor="Lastname">Prenom</Label> 
    <Input type="text" id="Lastname" name='Lastname' placeholder="Votre prenom"  className='w-full  px-3
    py-2 border border-SecondaryColor rounded-md' required/>
  </div>
  <div className='space-y-0.5'>
    <Label htmlFor="email">Email</Label> 
    <Input type="email" id="email" name='email' placeholder="Votre email"  className='w-full  px-3
    py-2 border border-SecondaryColor rounded-md' required/>
  </div>
  <div className='space-y-0.5'>
    <Label htmlFor="message">Message</Label> 
    <Textarea rows={6} id="message" name='message' placeholder="Votre message"  className='w-full  px-3
    py-2 border border-SecondaryColor rounded-md' required/>
  </div>
  <button type='submit' className='bg-darkColor/80 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-darkColor hoverEffect '>Envoyer votre message</button>
</form>
      </Container>
    </div>
  )
}

export default ContactPage
