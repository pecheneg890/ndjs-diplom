import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/user/schemas/user.schema';
import { ClientRequestDto } from './dto/client-request.dto';
import { SupportRequestClientService } from './support-request-client.service';
import { User } from 'src/decorators/user.decorator';
import { SupportRequestService } from './support-request.service';
import { MarkReadDto } from './dto/mark-read.dto';
import { IReqUser } from 'src/common/common.interfaces';

@Controller()
export class ChatController {
    constructor(private readonly clientService: SupportRequestClientService,
        private readonly supportService: SupportRequestService
    ) {

    }
    @Post('client/support-requests')
    @Roles([Role.client])
    @UsePipes(new ValidationPipe())
    async createClientRequest(@Body() dto: ClientRequestDto, @User() user: IReqUser) {
        const request = await this.clientService.createSupportRequest({ text: dto.text, user: user.id });

        return {
            id: request._id,
            createdAt: request.messages[0].sentAt,
            isActive: request.isActive,
            hasNewMessages: false,
        }
    }

    @Get('client/support-requests')
    @Roles([Role.client])
    async getClientRequests(
        @Query('limit', ParseIntPipe) limit: number,
        @Query('offset', ParseIntPipe) offset: number,
        @Query('isActive', ParseBoolPipe) isActive: boolean,
        @User() user: IReqUser
    ) {
        const requests = await this.supportService.findSupportRequests({
            user: user.id,
            isActive,
            limit,
            offset
        });

        return requests.map(el => ({
            id: el._id,
            createdAt: el.createdAt,
            isActive: el.isActive,
            hasNewMessages: el.messages.some(el => !el.readAt)
        }));
    }


    @Get('manager/support-requests')
    @Roles([Role.manager])
    async getManagerRequests(
        @Query('limit', ParseIntPipe) limit: number,
        @Query('offset', ParseIntPipe) offset: number,
        @Query('isActive', ParseBoolPipe) isActive: boolean
    ) {
        const requests = await this.supportService.findSupportRequests({
            user: null,
            isActive,
            limit,
            offset
        });

        return requests.map(el => ({
            id: el._id,
            createdAt: el.createdAt,
            isActive: el.isActive,
            hasNewMessages: el.messages.some(el => !el.readAt),
            client: {
                id: el.user._id,
                name: el.user.name,
                email: el.user.email,
                contactPhone: el.user.contactPhone
            }
        }));
    }

    @Get('common/support-requests/:id/messages')
    @Roles([Role.client, Role.manager])
    async getMessages(@Param('id') supportRequestId: string) {
        const messages = await this.supportService.getMessages(supportRequestId);

        return messages.map(el => ({
            id: el._id,
            createdAt: el.sentAt,
            text: el.text,
            readAt: el.readAt,
            author: {
                id: el.author._id,
                name: el.author.name
            }
        })
        );
    }

    @Post('common/support-requests/:id/messages')
    @Roles([Role.client, Role.manager])
    @UsePipes(new ValidationPipe())
    async addMessageToRequest(
        @Param('id') supportRequestId: string,
        @Body() dto: ClientRequestDto,
        @User() user: IReqUser) {

        const message = await this.supportService.sendMessage(
            {
                author: user.id,
                text: dto.text,
                supportRequest: supportRequestId
            });

        return {
            id: message._id,
            createdAt: message.sentAt,
            text: message.text,
            readAt: message.readAt,
            author: {
                id: message.author._id,
                name: message.author.name
            }
        };
    }

    @Post('common/support-requests/:id/messages/read')
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles([Role.client, Role.manager])
    async markMessagesAsRead(
        @Param('id') supportRequestId: string,
        @User() user: IReqUser,
        @Body() dto: MarkReadDto) {
        await this.clientService.markMessagesAsRead({
            user: user.id,
            supportRequest: supportRequestId,
            createdBefore: dto.createdBefore
        });

        return {
            success: true
        };
    }

    @Get('common/support-requests/:id/unread')
    @Roles([Role.client, Role.manager])
    async getUnreadCount(@Param('id') supportRequestId: string) {
        return this.clientService.getUnreadCount(supportRequestId);
    }
}
