// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Customer } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../client'

export interface OrderInput {
  customer: Customer
  productId: number
  quantity: number
}

export default async function createOrderHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productId, quantity, customer } = req.body
  const { name, email, address } = customer

  // Get the product
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  })
  console.log(product);
  // If the product is null its out of stock, return error.
  if (!product) return new Error('Out of stock')

  // If the customer is new then create the record, otherwise connect via their unique email
  const result = await prisma.customerOrder.create({
    data: {
      customer: {
        connectOrCreate: {
          create: {
            name,
            email,
            address,
          },
          where: {
            email,
          },
        },
      },
      orderDetails: {
        create: {
          total: product.price,
          quantity,
          products: {
            connect: {
              id: product.id,
            },
          },
        },
      },
    },
    include: {
      customer: true,
    }
  })

  console.log(result);
  return res.status(200).json(result);
}
