<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class RickAndMortyGetAllApiAction extends AbstractController
{
    #[Route('/api/list-all', name: 'api_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        // Sample data; replace with database query (e.g., Doctrine)
        $posts = [
            ['id' => 1, 'title' => 'Hello World'],
            ['id' => 2, 'title' => 'Symfony is awesome'],
        ];

        return $this->json($posts);
    }
}
