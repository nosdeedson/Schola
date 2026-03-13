import { NestFactory } from "@nestjs/core";
import { AppModule } from "./infrastructure/api/controllers/app/AppModule";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    const config = new DocumentBuilder()
        .setTitle('Schola')
        .setDescription('The Schola API description')
        .setVersion('1.0')
        .addTag('Schola')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-swagger', app, documentFactory);
    await app.listen(3000)
    console.log('listen 3000')
}

bootstrap()