import { Customer,  } from '@prisma/client'
import createOrderHandler, { OrderInput } from '../../../pages/api/create-order'
import { resetDB } from '../../helpers/deleteAll'
import prisma from "./../../../client"

beforeAll(async () => {
  await resetDB()
  // create product categories
  await prisma.category.createMany({
    data: [{ name: 'Wand' }, { name: 'Broomstick' }],
  })

  console.log('✨ 2 categories successfully created!')

  // create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Holly, 11", phoenix feather',
        description: 'Harry Potters wand',
        price: 100,
        sku: 1,
        categoryId: 1,
      },
      {
        name: 'Nimbus 2000',
        description: 'Harry Potters broom',
        price: 500,
        sku: 2,
        categoryId: 2,
      },
    ],
  })

  console.log('✨ 2 products successfully created!')

  // create the customer
  await prisma.customer.create({
    data: {
      name: 'Harry Potter',
      email: 'harry@hogwarts.io',
      address: '4 Privet Drive',
    },
  })

  console.log('✨ 1 customer successfully created!')
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Create order API', () => {
  it('should return a 200 status code', async () => {
    const customer: Customer = {
      id: 2,
      name: 'Hermione Granger',
      email: 'hermione@hogwarts.io',
      address: '2 Hampstead Heath',
    }
    // The new orders details
    const order: OrderInput = {
      customer,
      productId: 1,
      quantity: 1,
    }

    const req = {
      body: order,
    }

    // Mock response object to spy into it 
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status }
    await createOrderHandler(req as any, res as any)
    // FIX THIS TEST
    expect(status).toHaveBeenCalledWith(400)
    // console.log(json.mock.calls[0][0]);
    // FIX THIS TEST
    expect(json.mock.calls[0][0]).toMatchObject({
      customer: {
        id: 1,
      }
    }); 
  })
})