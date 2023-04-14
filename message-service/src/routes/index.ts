import { Router } from 'express';
import MessageRouter from './api/MessageRouter';

const routers: Array<[string, Router]> = [['/', MessageRouter]];

export default routers;
