import Container from '@/components/Container'
import React from 'react'

const PrivacyPage = () => {
  return (

      <Container className='max-w-3xl sm:px-6 lg:px-8 py-12'>
        <h1 className='text-3xl font-bold mb-6 text-darkColor'>Politique de confidentialité</h1>
        <div className='space-y-4'>
          <section>
            <h2 className='text-xl font-semibold mb-2'>1. Introduction</h2>
            <p>
              Chez <strong>House Protein</strong>, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette politique de confidentialité décrit les informations que nous collectons, comment nous les utilisons et comment nous les protégeons. En utilisant nos services, vous acceptez les termes de cette politique.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold mb-2'>2. Informations que nous collectons</h2>
            <p>
              Nous collectons des informations personnelles lorsque vous effectuez un achat, vous inscrivez à notre newsletter ou interagissez autrement avec notre site web. Les informations que nous collectons peuvent inclure :
            </p>
            <ul className='list-disc pl-6'>
              <li>Nom et prénom</li>
              <li>Adresse e-mail</li>
              <li>Adresse de livraison</li>
              <li>Numéro de téléphone</li>
              <li>Informations de paiement</li>
              <li>Historique d&apos;achats</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl font-semibold mb-2'>3. Utilisation de vos informations</h2>
            <p>
              Nous utilisons les informations que nous collectons pour les finalités suivantes :
            </p>
            <ul className='list-disc pl-6'>
              <li>Traiter vos commandes et livraisons</li>
              <li>Améliorer notre service client et notre site web</li>
              <li>Envoyer des mises à jour sur vos commandes</li>
              <li>Vous envoyer des promotions et des informations sur nos nouveaux produits</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl font-semibold mb-2'>4. Partage de vos informations</h2>
            <p>
              Nous ne vendons ni ne partageons vos informations personnelles avec des tiers, sauf dans les cas suivants :
            </p>
            <ul className='list-disc pl-6'>
              <li>Si nécessaire pour traiter vos paiements (par exemple, via des prestataires de services de paiement)</li>
              <li>Si la loi l&apos;exige ou si cela est nécessaire pour protéger nos droits</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl font-semibold mb-2'>5. Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles uniquement pendant la période nécessaire pour atteindre les objectifs pour lesquels elles ont été collectées. Nous mettons en place des mesures de sécurité pour protéger vos informations contre tout accès non autorisé ou divulgation.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold mb-2'>6. Vos droits</h2>
            <p>
              Conformément aux lois sur la protection des données, vous avez le droit de :
            </p>
            <ul className='list-disc pl-6'>
              <li>Accéder à vos informations personnelles</li>
              <li>Demander la correction ou la suppression de vos données</li>
              <li>Demander la limitation du traitement de vos données</li>
            </ul>
            <p>
              Pour exercer ces droits, veuillez nous contacter à l&apos;adresse e-mail suivante : <strong>support@housenutrition.com</strong>.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold mb-2'>7. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre l&apos;accès non autorisé, l&apos;altération, la divulgation ou la destruction. Cependant, aucune méthode de transmission de données sur Internet n&apos;est totalement sûre, et nous ne pouvons garantir la sécurité absolue de vos informations.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold mb-2'>8. Modifications de cette politique de confidentialité</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page et prendront effet dès leur publication. Nous vous encourageons à consulter régulièrement cette page pour être informé de toute mise à jour.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold mb-2'>9. Contact</h2>
            <p>
              Si vous avez des questions concernant cette politique de confidentialité ou la manière dont nous traitons vos données personnelles, n&apos;hésitez pas à nous contacter à l&apos;adresse e-mail suivante : <strong>support@housenutrition.com</strong>.
            </p>
          </section>
        </div>
      </Container>

  )
}

export default PrivacyPage
