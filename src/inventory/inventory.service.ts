import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dtos/create-inventory.dto';
import { UpdateInventoryDto } from './dtos/update-inventory.dto';

@Injectable()
export class InventoryService {
    private readonly logger = new Logger(InventoryService.name)
    constructor(
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory> 
    ) {}

    /**
     * 
     * @param createInventoryDto 
     * @returns Inventory object
     */
    async createInventory(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
        try {
            const inventory: Inventory = this.inventoryRepository.create({ quantity: createInventoryDto.quantity });
            return await this.inventoryRepository.save(inventory);
        } catch(error) {
            this.logger.error(`Unable to create inventory: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateInventory(updateInventoryDto: UpdateInventoryDto): Promise<UpdateResult> {
        try {
            return await this.inventoryRepository.update({ product: { id: updateInventoryDto.productId }}, { quantity: updateInventoryDto.quantity });
        } catch(error) {
            this.logger.error(`Unable to update Inventory: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }
}
