<?php

namespace App\Controller\Action;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/rick-and-morty')]
class RickAndMortyController extends AbstractController
{
    #[Route('/all', name: 'rick_and_morty_all')]
    public function index(): Response
    {
        return $this->render('rick_and_morty/list.html.twig', [
            'title' => 'Rick and Morty Characters',
        ]);
    }
}
