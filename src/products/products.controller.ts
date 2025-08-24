import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { Product } from './products.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAll(
    @Query() searchDto: SearchProductsDto,
  ): Promise<PaginatedResponseDto<Product>> {
    return this.productsService.findAll(searchDto);
  }

  @Post()
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.productsService.delete(id);
  }

  @Post('seed')
  createSampleData(): Promise<{ message: string }> {
    return this.productsService.createSampleData().then(() => ({
      message: 'Sample data created successfully',
    }));
  }
}
