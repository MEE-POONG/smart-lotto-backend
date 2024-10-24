import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { ItemTypeModule } from './item-type/item-type.module';


@Module({
  imports: [PrismaModule, CustomerModule, AuthModule, UserModule, EnterpriseModule, ItemTypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
