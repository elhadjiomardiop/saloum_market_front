'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list)

    return (
        <div className='px-4 sm:px-6 my-16 sm:my-24 max-w-6xl mx-auto'>
            <Title
                title='Meilleures ventes'
                description={`Affichage de ${products.length < displayQuantity ? products.length : displayQuantity} produit(s) sur ${products.length}`}
                href='/shop'
            />
            <div className='mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {products.slice().sort((a, b) => b.rating.length - a.rating.length).slice(0, displayQuantity).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSelling
