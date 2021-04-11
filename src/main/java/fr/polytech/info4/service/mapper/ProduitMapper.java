package fr.polytech.info4.service.mapper;

import fr.polytech.info4.domain.*;
import fr.polytech.info4.service.dto.ProduitDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Produit} and its DTO {@link ProduitDTO}.
 */
@Mapper(componentModel = "spring", uses = { RestaurantMapper.class, PanierMapper.class })
public interface ProduitMapper extends EntityMapper<ProduitDTO, Produit> {
    @Mapping(target = "restaurant", source = "restaurant", qualifiedByName = "id")
    @Mapping(target = "panier", source = "panier", qualifiedByName = "id")
    ProduitDTO toDto(Produit s);
}
