import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, SelectQueryBuilder } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
  ) {}

  async findAll(
    searchDto?: SearchProductsDto,
  ): Promise<PaginatedResponseDto<Product>> {
    const {
      search,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = searchDto || {};

    // Create query builder
    const queryBuilder = this.productsRepo.createQueryBuilder('product');

    // Add search conditions
    if (search) {
      queryBuilder.where(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Add sorting
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

    // Add pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepo.create(dto);
    return this.productsRepo.save(product);
  }

  async delete(id: string): Promise<void> {
    const result = await this.productsRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  // Helper method to create sample data for testing
  async createSampleData(): Promise<void> {
    const sampleProducts = [
      {
        name: 'iPhone 15 Pro',
        price: 999.99,
        description: 'Latest iPhone with advanced features',
      },
      {
        name: 'Samsung Galaxy S24',
        price: 899.99,
        description: 'Premium Android smartphone',
      },
      {
        name: 'MacBook Pro M3',
        price: 1999.99,
        description: 'Powerful laptop for professionals',
      },
      {
        name: 'Dell XPS 13',
        price: 1299.99,
        description: 'Ultrabook with excellent performance',
      },
      {
        name: 'iPad Air',
        price: 599.99,
        description: 'Versatile tablet for work and play',
      },
      {
        name: 'Sony WH-1000XM5',
        price: 349.99,
        description: 'Premium noise-canceling headphones',
      },
      {
        name: 'Apple Watch Series 9',
        price: 399.99,
        description: 'Smartwatch with health features',
      },
      {
        name: 'Nintendo Switch OLED',
        price: 349.99,
        description: 'Gaming console for all ages',
      },
      {
        name: 'Canon EOS R6',
        price: 2499.99,
        description: 'Professional mirrorless camera',
      },
      {
        name: 'DJI Mini 3 Pro',
        price: 759.99,
        description: 'Compact drone with 4K camera',
      },
    ];

    for (const productData of sampleProducts) {
      const existingProduct = await this.productsRepo.findOne({
        where: { name: productData.name },
      });

      if (!existingProduct) {
        const product = this.productsRepo.create(productData);
        await this.productsRepo.save(product);
      }
    }
  }
}
