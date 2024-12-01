import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RulesService } from './rules.service';

@ApiTags('rules')
@Controller('rules')
export class RulesController {
  constructor(private ruleService: RulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rule' })
  @ApiResponse({ status: 201, description: 'The rule has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createRule(@Body() createRuleDto: CreateRuleDto) {
    return this.ruleService.createRule(createRuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rules for a user' })
  @ApiResponse({ status: 200, description: 'List of rules.' })
  async getRules(@Query('email') email: string) {
    return this.ruleService.getRulesByUser(email);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rule by ID' })
  @ApiResponse({ status: 200, description: 'The rule has been successfully deleted.' })
  async deleteRule(@Param('id') id: string) {
    return this.ruleService.deleteRule(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rule by ID' })
  @ApiResponse({ status: 200, description: 'The rule has been successfully updated.' })
  async updateRule(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.ruleService.updateRule(id, updateRuleDto);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a deleted rule by ID' })
  @ApiResponse({ status: 200, description: 'The rule has been successfully restored.' })
  async restoreRule(@Param('id') id: string) {
    return this.ruleService.restoreRule(id);
  }
}
