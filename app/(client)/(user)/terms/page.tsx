import Container from '@/components/Container'
import React from 'react'

const TermsPage = () => {
  return (
    <div>
      <Container className='max-w-3xl sm:px-6 lg:px-8 py-12'>
        <h1 className='text-3xl font-bold mb-6 text-darkColor'>Conditions Générales de Vente</h1>
        <div className='space-y-6'>
          <section>
            <h2 className='text-xl font-semibold mb-2'>1. Acceptation des Conditions</h2>
            <p>En accédant ou en utilisant notre site internet et nos services, vous acceptez d&apos;être lié par les présentes Conditions Générales de Vente. Si vous n&apos;acceptez pas ces conditions, vous devez cesser d&apos;utiliser nos services immédiatement.</p>
          </section>
          <section>
            <h2 className='text-xl font-semibold mb-2'>2. Description des Services</h2>
            <p>Nous fournissons des produits nutritionnels de haute qualité. En passant commande, vous acceptez d&apos;acheter ces produits selon les termes définis dans ce document.</p>
          </section>
          <section>
            <h2 className='text-xl font-semibold mb-2'>3. Obligations d&apos;Inscription</h2>
            <p>Pour utiliser nos services, vous vous engagez à fournir des informations exactes et complètes lors de votre inscription ou de votre commande. Il est de votre responsabilité de mettre à jour vos informations si nécessaire.</p>
          </section>
          <section>
            <h2 className='text-xl font-semibold mb-2'>4. Compte Utilisateur, Mot de Passe et Sécurité</h2>
            <p>Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités qui se produisent sous votre compte. Si vous constatez une utilisation non autorisée de votre compte, vous devez nous en informer immédiatement.</p>
          </section>
          <section>
            <h2 className='text-xl font-semibold mb-2'>5. Conduite de l&apos;Utilisateur</h2>
            <p>Vous vous engagez à ne pas utiliser nos services à des fins illégales ou interdites. Toute violation de ces conditions peut entraîner la résiliation immédiate de votre accès à nos services.</p>
          </section>
          <section>
            <h2 className='text-xl font-semibold mb-2'>6. Collecte d&apos;E-mails à des Fins Marketing</h2>
            <p>
              Lors de la commande, nous collectons votre adresse e-mail afin de vous envoyer des notifications importantes relatives à votre commande. Avec votre consentement, nous pourrons également utiliser votre adresse e-mail pour vous envoyer des communications marketing, des informations sur nos nouveaux produits, ainsi que des offres exclusives. 
              Vous pouvez à tout moment vous désabonner de ces communications marketing en suivant le lien de désinscription dans nos e-mails.
            </p>
          </section>
          <section>
            <h2 className='text-xl font-semibold mb-2'>7. Propriété Intellectuelle</h2>
            <p>Tous les contenus présents sur ce site (textes, images, logos, etc.) sont protégés par des droits de propriété intellectuelle. Vous n&apos;êtes pas autorisé à utiliser, reproduire ou distribuer ces contenus sans notre consentement préalable écrit.</p>
          </section>
          <section>
            <h2 className='text-xl font-semibold mb-2'>8. Modification des Conditions</h2>
            <p>Nous nous réservons le droit de modifier ces Conditions Générales de Vente à tout moment. Les modifications seront publiées sur cette page et prendront effet dès leur publication. Nous vous encourageons à consulter régulièrement cette page.</p>
          </section>
        </div>
      </Container>
    </div>
  )
}

export default TermsPage
